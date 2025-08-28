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

app = FastAPI()

@app.post("/analyze-video/")
async def analyze_video(file: UploadFile = File(...), exercise: str = Form(...)):
    video = file.file
    with open("input.mp4", "wb") as buffer:
        shutil.copyfileobj(video, buffer)
    
    capture = cv.VideoCapture("input.mp4")
    fourcc = cv.VideoWriter_fourcc(*"mp4v")
    fps = int(capture.get(cv.CAP_PROP_FPS))
    width = int(capture.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv.CAP_PROP_FRAME_HEIGHT))
    output = cv.VideoWriter("processed.mp4", fourcc, fps, (width, height))

    if (exercise == "BICEP CURL"):
        score = analyze_bicep_curl(output, capture)

    capture.release()
    output.release()
    return {"message": "Video Processed", "file": "processed.mp4", "total_score": score}


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

        return total_score

        
def eccentric_score(duration):
    if duration < 0.5:
        return 0
    # Gaussian curve centered at 3s, width 1s
    return round(10 * math.exp(-((duration - 3)**2) / (2 * (1**2))))