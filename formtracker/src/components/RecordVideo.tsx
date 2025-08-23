import React, { useEffect, useState } from 'react';
import { useRecordWebcam } from 'react-record-webcam'

type RecordVideoProps = {
    onRecordingComplete: (file: File) => void;
  };

const RecordVideo: React.FC<RecordVideoProps> = ({ onRecordingComplete }) => {
    const { createRecording, openCamera, startRecording, stopRecording, closeCamera } = useRecordWebcam();
    const [recording, setRecording] = useState<any>(null);
    const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
    const recordVideo = async () => {
        const rec = await createRecording();
        
        if (rec) {
            setRecording(rec);
            await openCamera(rec.id);
            await startRecording(rec.id);
            // Record for 15 seconds
            await new Promise(resolve => setTimeout(resolve, 15000));
            const recorded = await stopRecording(rec.id);
            if (recorded && recorded.blob) {
                const file = new File([recorded.blob], "recorded-video.mp4", { type: recorded.blob.type })
                onRecordingComplete(file);

                const url = URL.createObjectURL(recorded.blob);
                setRecordedVideoURL(url);

                setRecording(null);
            }
            await closeCamera(rec.id);
        }
    }

    useEffect(() => {
        recordVideo();
    }, [])

    return (
        <div className='w-[80%] h-96 border-[4px] border-dotted border-black rounded-md flex justify-center items-center hover:cursor-pointer'>
            {recording ? (
                <video ref={recording.webcamRef} autoPlay muted className="w-full h-full object-contain" />
            ) : recordedVideoURL ? (
                <video src={recordedVideoURL} controls className="w-full h-full object-contain" />
            ) : (
                <p>Starting camera...</p>
            )}
        </div>
    )
}

export default RecordVideo;