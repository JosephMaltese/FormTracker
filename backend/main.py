# uvicorn main:app --reload
# source venv/bin/activate
from fastapi import FastAPI, UploadFile, File, Form
import shutil
import cv2 as cv
import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose
import numpy as np
import math
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE etc.
    allow_headers=["*"],  # allow all headers
    expose_headers=["total_score", "gpt_analysis"],
)

@app.post("/analyze-video/")
async def analyze_video(file: UploadFile = File(...), exercise: str = Form(...)):
    video = file.file
    with open("input.mp4", "wb") as buffer:
        shutil.copyfileobj(video, buffer)
    
    capture = cv.VideoCapture("input.mp4")
    # fourcc = cv.VideoWriter_fourcc(*"mp4v")
    fourcc = cv.VideoWriter_fourcc(*"avc1")
    fps = int(capture.get(cv.CAP_PROP_FPS))
    width = int(capture.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv.CAP_PROP_FRAME_HEIGHT))
    output = cv.VideoWriter("processed.mp4", fourcc, fps, (width, height))

    if (exercise == "BICEP CURL"):
        (score, rep_count, complete_rom_rep_count, partial_rom_rep_count, cheat_rep_count, eccentric_durations, min_and_max_rep_angles) = analyze_bicep_curl(output, capture)
        developer_prompt = "You are a helpful personal fitness assistant, providing feedback to a user regarding their exercise form. They will tell you which exercise they performed, and will provide some details about how they performed it (ex. relevant joint angles, eccentric rep duration, range of motion, etc.), and you will respond with a paragraph of constructive feedback, noting both the highlights and the drawbacks (if applicable) of their set. Do not judge them based on the number of repetitions they performed, as they only have 15 seconds to perform their set, so the purpose of this is to judge only their form while performing the set. They will tell you the total number of repetitons they performed, the number of those reps which were performed with complete range of motion (ROM), the number of those reps which were performed with partial ROM, the number of those which were performed with incomplete ROM, the number of those reps which were cheat reps, as well as a list of the durations of the eccentric motion of their reps, and a list containing a tuple for each rep, where the first element in the tuple is the minimum angle in the rep and the second element is the maximum angle in the rep. For clarity, a rep counts as any significant up + down movement. We use the angle between the elbow, shoulder, and wrist when analyzing the form. A rep with complete ROM is one where the minimum angle is <= 40 degrees and the maximum angle is >= 160 degrees. A partial ROM rep is one where one of the those two conditions don't hold. An incomplete rep is one where neither of those conditions are met. When analyzing cheat reps, we look at the angle between the hip, shoulder, and the vertical. If this angle deviates more than 6 degrees during the rep, we count it as a cheat rep (meaning they either used momentum or used poor posture to get their arm up). The eccentric durations are the amount of time it takes for the bicep to go from the contracted position to an elongated position. If the eccentric duration for a rep is less than 0.5s, we assign it a score of zero. Otherwise, we use a Gaussian curve centered at 3s with a width of 1s. Thus, reps ideally have an eccentric duration of 2-4s. Do not get too technical (for example, saying the exact angle their arm should bend at), but instead explain it to them in an understandable manner as if you were a personal trainer (ex. 'try to squeeze the bicep at the top and go slower on your eccentric motion'). Do not include any filler text/phrases (such as saying 'absolutely!'). Just provide your analysis."
        user_prompt = f"Analyze my bicep curl form. I completed {rep_count} reps in total. {complete_rom_rep_count} of these reps were performed with complete ROM. {partial_rom_rep_count} of these reps were performed with partial ROM. {rep_count - complete_rom_rep_count - partial_rom_rep_count} of these reps were performed with incomplete ROM. {cheat_rep_count} of the reps were cheat reps. My eccentric durations were {eccentric_durations}. My minimum and maximum angles for each rep were {min_and_max_rep_angles}."
    else:
        score = 0
        user_prompt = ""
    capture.release()
    output.release()


    # gptResponse = client.chat.completions.create(
    # model="gpt-4o-mini",
    # messages=[
    #     {"role": "developer", "content": developer_prompt},
    #     {"role": "user", "content": user_prompt}
    # ]
    # )

    # gpt_analysis = gptResponse.choices[0].message.content
    gpt_analysis = "great work!" # Temporary value
    encoded_analysis = base64.b64encode(gpt_analysis.encode('utf-8')).decode('ascii')
    
    return FileResponse(
        "processed.mp4",
        media_type="video/mp4",
        filename="processed.mp4",
        headers={"total_score": str(score), "gpt_analysis": encoded_analysis }
    )


def calculate_angle(a, b, c):
    a = np.array(a) # First
    b = np.array(b) # Midpoint
    c = np.array(c) # Endpoint

    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)

    if angle > 180.0:
        angle = 360-angle
    return angle


def analyze_bicep_curl(output, capture):
        attempted_rep_counter = 0
        complete_rom_rep_counter = 0
        partial_rom_rep_counter = 0
        cheat_rep_count = 0
        stage = None
        last_recorded_angle = None
        min_angle_in_rep = None
        max_angle_in_rep = None
        cheat_rep_detected = False
        torso_angle_at_rep_start = None
        starting_torso_angle_recorded = False
        fps = capture.get(cv.CAP_PROP_FPS)
        frame_count = 0
        eccentric_durations = []
        eccentric_start_time = None
        min_and_max_rep_angles = []

        with mp_pose.Pose(
        min_detection_confidence = 0.5,
        min_tracking_confidence = 0.5) as pose:
            while capture.isOpened():
                isTrue, frame = capture.read()
                if not isTrue:
                    break

                frame.flags.writeable = False
                frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
                results = pose.process(frame)

                frame.flags.writeable = True
                frame = cv.cvtColor(frame, cv.COLOR_RGB2BGR)

                frame_count += 1
                current_time = frame_count / fps

                # Extract Landmarks
                try:
                    landmarks = results.pose_landmarks.landmark

                    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                    vertical = np.array([0,1])

                    angle = calculate_angle(shoulder, elbow, wrist)

                    torso_angle = calculate_angle(shoulder, hip, np.array(hip)+vertical)

                    # Visualize angles
                    cv.putText(frame, str(angle), 
                                    tuple(np.multiply(elbow, [1620, 1080]).astype(int)),
                                        cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv.LINE_AA
                                )
                    cv.putText(frame, str(torso_angle), 
                                    tuple(np.multiply(hip, [1620, 1080]).astype(int)),
                                        cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv.LINE_AA
                                )
                    
                    # Record starting torso angle when we're in the down position
                    if angle >= 160.0 and not starting_torso_angle_recorded:
                        torso_angle_at_rep_start = torso_angle
                        starting_torso_angle_recorded = True
                    
                    # Check for cheating during the concentric phase (when going up)
                    if stage == "moving_up" and angle <= 45.0 and starting_torso_angle_recorded:
                        torso_movement = abs(torso_angle - torso_angle_at_rep_start)
                        if torso_movement >= 6.0 and not cheat_rep_detected:
                            cheat_rep_detected = True
                            cheat_rep_count += 1
                            print(f"Cheat detected! Torso movement: {torso_movement:.1f}°")


                    # rep counter logic
                    if last_recorded_angle is not None:
                        if (angle - last_recorded_angle <= -5.0):
                            if (stage is None or stage == "moving_down"):
                                stage="moving_up"

                                # Start tracking a new rep
                                min_angle_in_rep = angle
                                max_angle_in_rep = max(last_recorded_angle, angle)

                                if eccentric_start_time is not None:
                                    eccentric_duration = current_time - eccentric_start_time
                                    eccentric_durations.append(eccentric_duration)
                                    print(f"Eccentric duration:", eccentric_duration)
                                    eccentric_start_time = None

                            last_recorded_angle = angle
                        elif (angle - last_recorded_angle >= 5.0):
                            if stage=="moving_up":
                                # First, ensure that the rep is valid and not just random movement (ex. walking)
                                if (abs(max_angle_in_rep - min_angle_in_rep) >= 20.0):
                                    stage = "moving_down"
                                    attempted_rep_counter += 1

                                    eccentric_start_time = current_time
                                    
                                    # Update min/max angles for this rep
                                    if min_angle_in_rep is not None:
                                        min_angle_in_rep = min(min_angle_in_rep, angle)
                                        max_angle_in_rep = max(max_angle_in_rep, angle)
                                    
                                    # Determine if this was a complete or partial rep
                                    if min_angle_in_rep is not None and max_angle_in_rep is not None:
                                        if min_angle_in_rep < 40.0 and max_angle_in_rep > 160.0:
                                            complete_rom_rep_counter += 1
                                            print("Complete rep")
                                        else:
                                            partial_rom_rep_counter += 1
                                            print("Partial rep")
                                    
                                    # Store min and max rep angles
                                    min_and_max_rep_angles.append((min_angle_in_rep, max_angle_in_rep))

                                    # Reset for next rep
                                    min_angle_in_rep = None
                                    max_angle_in_rep = None
                                    cheat_rep_detected = False
                                    starting_torso_angle_recorded = False
                            last_recorded_angle = angle
                    else:
                        if angle > 140.0:
                            last_recorded_angle = angle

                    # Update min/max angles during the rep
                    if min_angle_in_rep is not None:
                        min_angle_in_rep = min(min_angle_in_rep, angle)
                        max_angle_in_rep = max(max_angle_in_rep, angle)
                except:
                    pass

                # Render curl counter
                # Setup status box
                cv.rectangle(frame, (0,0), (225,73), (245,117,16), -1)

                # Rep data
                cv.putText(frame, 'REPS', (15,12), 
                            cv.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv.LINE_AA)
                cv.putText(frame, str(attempted_rep_counter), 
                            (10,60), 
                            cv.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv.LINE_AA)
                
                # Stage data
                cv.putText(frame, 'STAGE', (65,12), 
                            cv.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv.LINE_AA)
                cv.putText(frame, stage, 
                            (60,60), 
                            cv.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv.LINE_AA)

                # Cheat indicator
                if cheat_rep_detected:
                    cv.putText(frame, 'CHEAT!', (60,60), 
                                cv.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2, cv.LINE_AA)


                

                mp_drawing.draw_landmarks(
                    frame,
                    results.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                )
                output.write(frame)
        print("Eccentric durations:", eccentric_durations)
        print("Total rep count:", attempted_rep_counter)
        print("Complete ROM rep count:", complete_rom_rep_counter)
        print("Partial ROM rep count:", partial_rom_rep_counter)
        print("Cheat rep count:", cheat_rep_count)


        # Initialize total form analysis score to 0
        total_score = 0

        # First, award the user 10 points for completing at least one valid repetition (up + down movement)
        if attempted_rep_counter >= 1:
            total_score += 10
        
        # Next, evaluate the ROM of the reps. Award 2 points for full ROM, 1 point for partial ROM
        possible_rom_points = attempted_rep_counter * 2
        acheived_rom_points = (complete_rom_rep_counter * 2) + (partial_rom_rep_counter)
        rom_score = (acheived_rom_points / possible_rom_points) * 30
        total_score += rom_score

        # Then, assess the stability of the user's form
        stable_reps = attempted_rep_counter - cheat_rep_count
        stability_score = (stable_reps / attempted_rep_counter) * 40
        total_score += stability_score

        # Finally, asses the duration of the user's eccentric motion
        possible_duration_points = attempted_rep_counter * 10
        duration_points = 0
        for duration in eccentric_durations:
            duration_points += eccentric_score(duration)
        duration_score = (duration_points / possible_duration_points) * 20
        total_score += duration_score

        return (total_score, attempted_rep_counter, complete_rom_rep_counter, partial_rom_rep_counter, cheat_rep_count, eccentric_durations, min_and_max_rep_angles)

        
def eccentric_score(duration):
    if duration < 0.5:
        return 0
    # Gaussian curve centered at 3s, width 1s
    return round(10 * math.exp(-((duration - 3)**2) / (2 * (1**2))))