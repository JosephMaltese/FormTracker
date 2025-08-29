import React, { useEffect, useState } from 'react';
import { useRecordWebcam } from 'react-record-webcam'
import { Camera, Loader2 } from 'lucide-react';

type RecordVideoProps = {
    onRecordingComplete: (file: File) => void;
  };

const RecordVideo: React.FC<RecordVideoProps> = ({ onRecordingComplete }) => {
    const { createRecording, openCamera, startRecording, stopRecording, closeCamera } = useRecordWebcam();
    const [recording, setRecording] = useState<any>(null);
    const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const recordVideo = async () => {
        setIsLoading(true);
        const rec = await createRecording();
        
        if (rec) {
            setRecording(rec);
            await openCamera(rec.id);
            await startRecording(rec.id);
            setIsLoading(false);
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
        <div className='w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex justify-center items-center dark:bg-gray-800/50 overflow-hidden'>
            {isLoading ? (
                <div className='flex flex-col items-center gap-3'>
                    <Loader2 className='h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin' />
                    <p className='text-gray-600 dark:text-gray-400 font-medium text-sm'>Starting camera...</p>
                </div>
            ) : recording ? (
                <div className='w-full h-full p-2 relative'>
                    <video 
                        ref={recording.webcamRef} 
                        autoPlay 
                        muted 
                        className="w-full h-full object-contain rounded-lg shadow-lg" 
                    />
                    <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse'>
                        Recording...
                    </div>
                </div>
            ) : recordedVideoURL ? (
                <div className='w-full h-full p-2'>
                    <video 
                        src={recordedVideoURL} 
                        controls 
                        className="w-full h-full object-contain rounded-lg shadow-lg" 
                    />
                </div>
            ) : (
                <div className='flex flex-col items-center gap-3'>
                    <Camera className='h-6 w-6 text-gray-400' />
                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Camera not available</p>
                </div>
            )}
        </div>
    )
}

export default RecordVideo;