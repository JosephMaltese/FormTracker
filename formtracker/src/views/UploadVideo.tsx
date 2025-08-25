import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FileInput from '../components/FileInput';
import RecordVideo from '../components/RecordVideo';
import MenuButton from "../components/ui/menuButton";
export default function UploadVideo() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const exercise = params.get("exercise");
    const [uploading, setUploading] = useState(true);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const navigate = useNavigate();
    
    function handleRecordClick() {
        setUploading(false);
        setVideoFile(null);
    }
    function handleRecordingComplete (file: File) {
        setVideoFile(file);
    }
    function handleFileSelect(file : File) {
        setVideoFile(file);
    }
    function handleSubmit() {
        if (!videoFile) {
            return;
        }
        navigate("/results", { state: { videoFile, exercise } });

    }

    return (
        <div className='flex flex-col items-center mt-20 dark:text-white'>
            {videoFile ? (
                <p>{videoFile.name}</p>
            ) : (
                <></>
            )}
            {
                uploading ? (
                    <div className='flex flex-col w-full h-full items-center'>
                        <FileInput onFileSelect={handleFileSelect}/>
                        <p className='font-bold text-xl mb-5 mt-5'>Or</p>
                        <button onClick={handleRecordClick}>
                            <div className='flex flex-col justify-center items-center gap-3 border-[3px] border-black dark:border-white dark:bg-gray-700 p-3 rounded-md'>
                                <img src="/images/video-camera.png" alt="Video Camera" className='h-20 w-20'></img>
                                <p className='w-44'>Record 15s video using webcam</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    
                    <RecordVideo onRecordingComplete={handleRecordingComplete}/>
                )
            }
            <div className='flex flex-row w-full justify-between px-5 absolute bottom-5'>
                <MenuButton text="< Previous page" link="/select-exercise" />
                {/* <MenuButton text="Analyze Video >" link=""/> */}
                <button onClick={handleSubmit} className='bg-gray-700 text-lg text-white font-semibold disabled:opacity-25 inline-block p-4 rounded-lg' disabled={!videoFile}>Analyze Video &gt;</button>
            </div>
        </div>
    )
}