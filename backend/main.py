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
        results = analyze_bicep_curl(output, capture)

    capture.release()
    output.release()
    return {"message": "Video Processed", "file": "processed.mp4"}


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
        # Initialize rep count to 0, and stage as nothing
        attempted_rep_counter = 0
        complete_rom_rep_counter = 0
        partial_rom_rep_counter = 0
        stage = None
        last_recorded_angle = None
        min_angle_in_rep = None
        max_angle_in_rep = None

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

                # Extract Landmarks
                try:
                    landmarks = results.pose_landmarks.landmark

                    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                    angle = calculate_angle(shoulder, elbow, wrist)

                    # Visualize angle
                    cv.putText(frame, str(angle), 
                                    tuple(np.multiply(elbow, [1620, 1080]).astype(int)),
                                        cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv.LINE_AA
                                )
                    
                    # rep counter logic
                    if last_recorded_angle is not None:
                        if (angle - last_recorded_angle <= -20.0) and (stage is None or stage == "moving_down"):
                            stage="moving_up"

                            # Start tracking a new rep
                            min_angle_in_rep = angle
                            max_angle_in_rep = max(last_recorded_angle, angle)


                            last_recorded_angle = angle
                            
                        elif (angle - last_recorded_angle >= 20.0) and stage=="moving_up":
                            stage = "moving_down"
                            attempted_rep_counter += 1
                            last_recorded_angle = angle
                            
                            # Update min/max angles for this rep
                            if min_angle_in_rep is not None:
                                min_angle_in_rep = min(min_angle_in_rep, angle)
                                max_angle_in_rep = max(max_angle_in_rep, angle)
                            
                            # Determine if this was a complete or partial rep
                            if min_angle_in_rep is not None and max_angle_in_rep is not None:
                                if min_angle_in_rep < 40.0 and max_angle_in_rep > 160.0:
                                    complete_rom_rep_counter += 1
                                else:
                                    partial_rom_rep_counter += 1
                            
                            # Reset for next rep
                            min_angle_in_rep = None
                            max_angle_in_rep = None
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


                

                mp_drawing.draw_landmarks(
                    frame,
                    results.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                )
                output.write(frame)
        print("Complete ROM rep count:", complete_rom_rep_counter)
        print("Partial ROM rep count:", partial_rom_rep_counter)