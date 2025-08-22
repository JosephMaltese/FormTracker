# uvicorn main:app --reload
# source venv/bin/activate
from fastapi import FastAPI, UploadFile, File
import shutil
import cv2 as cv
import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose
import numpy as np

app = FastAPI()

@app.post("/analyze-video/")
async def analyze_video(file: UploadFile = File(...)):
    video = file.file
    with open("input.mp4", "wb") as buffer:
        shutil.copyfileobj(video, buffer)
    
    capture = cv.VideoCapture("input.mp4")
    fourcc = cv.VideoWriter_fourcc(*"mp4v")
    fps = int(capture.get(cv.CAP_PROP_FPS))
    width = int(capture.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv.CAP_PROP_FRAME_HEIGHT))
    output = cv.VideoWriter("processed.mp4", fourcc, fps, (width, height))
    
    # Initialize rep count to 0, and stage as nothing
    counter = 0
    stage = None

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
                if angle > 160.0:
                    stage = "down"
                if angle < 40.0 and stage == "down":
                    stage = "up"
                    counter += 1
                    print(counter)
                
            except:
                pass

            # Render curl counter
            # Setup status box
            cv.rectangle(frame, (0,0), (225,73), (245,117,16), -1)

            # Rep data
            cv.putText(frame, 'REPS', (15,12), 
                        cv.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv.LINE_AA)
            cv.putText(frame, str(counter), 
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

        # cv.imshow('Video', frame)

        # if cv.waitKey(20) & 0xFF==ord('d'):
        #     break
    capture.release()
    output.release()
    # cv.destroyAllWindows()
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