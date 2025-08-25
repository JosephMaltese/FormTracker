import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FileInput from '../components/FileInput';
import RecordVideo from '../components/RecordVideo';
import MenuButton from "../components/ui/menuButton";
import { Button } from '../components/ui/button';
import { Play } from 'lucide-react';
import Navbar from '../components/ui/navbar';

export default function UploadVideo() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const exercise = params.get("exercise");
    const [uploading, setUploading] = useState(true);
    const [videoFile, setVideoFile] = useState(null);
    const navigate = useNavigate();
    
    function handleRecordClick() {
        setUploading(false);
        setVideoFile(null);
    }
    function handleRecordingComplete (file) {
        setVideoFile(file);
    }
    function handleFileSelect(file) {
        setVideoFile(file);
    }
    function handleSubmit() {
        if (!videoFile) {
            return;
        }
        navigate("/results", { state: { videoFile, exercise } });

    }

    return (
        <div className='flex flex-col dark:text-white'>
            <Navbar/>
            
            {videoFile ? (
                <p className='mt-4 text-center'>{videoFile.name}</p>
            ) : (
                <div className='mt-4'></div>
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
            <div className='flex flex-row w-full justify-between px-5 absolute bottom-3'>
                <MenuButton text="Previous page" link="/select-exercise" />
                <Button 
                    onClick={handleSubmit} 
                    disabled={!videoFile}
                    size="lg"
                    className="h-12 px-6 text-base font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Video
                </Button>
            </div>
        </div>
    )
}