import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FileInput from '../components/FileInput';
import RecordVideo from '../components/RecordVideo';
import MenuButton from "../components/ui/menuButton";
import { Button } from '../components/ui/button';
import { Play, Upload, Video } from 'lucide-react';
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
        <div className='h-screen flex flex-col dark:text-white bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden'>
            <Navbar/>
            
            {/* Header Section */}
            <div className='flex-shrink-0 pt-4 pb-2'>
                <div className='text-center'>
                    <h1 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Upload Your Video
                    </h1>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-1'>
                        Exercise: <span className='font-semibold text-blue-600 dark:text-blue-400'>{exercise}</span>
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Record or upload a 10-15 second video for form analysis
                    </p>
                </div>

                {/* File Status */}
                {videoFile && (
                    <div className='mt-3 mx-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <div className='flex items-center justify-center gap-2'>
                            <Upload className='w-4 h-4 text-green-600 dark:text-green-400' />
                            <p className='text-green-800 dark:text-green-200 font-medium text-sm'>{videoFile.name}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className='flex-1 flex items-start justify-center px-4 py-2'>
                {uploading ? (
                    <div className='flex flex-col w-full max-w-2xl items-center space-y-4'>
                        <div className='w-full h-64'>
                            <FileInput onFileSelect={handleFileSelect}/>
                        </div>
                        
                        <div className='flex items-center w-full max-w-md'>
                            <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600'></div>
                            <span className='px-3 text-gray-500 dark:text-gray-400 font-medium text-sm'>OR</span>
                            <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600'></div>
                        </div>
                        
                        <button 
                            onClick={handleRecordClick}
                            className='group transition-all duration-300 hover:scale-105'
                        >
                            <div className='flex flex-col justify-center items-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 p-6 rounded-xl hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300'>
                                <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300'>
                                    <Video className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                                </div>
                                <div className='text-center'>
                                    <h3 className='font-bold text-base mb-1 text-gray-800 dark:text-gray-200'>
                                        Record with Webcam
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-400 text-xs max-w-40'>
                                        Record a 15-second video using your webcam
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className='w-full max-w-2xl h-64'>
                        <RecordVideo onRecordingComplete={handleRecordingComplete}/>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className='flex-shrink-0 flex flex-row w-full justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700'>
                <MenuButton text="Previous page" link="/select-exercise" />
                <Button 
                    onClick={handleSubmit} 
                    disabled={!videoFile}
                    size="lg"
                    className="h-12 px-6 text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Video
                </Button>
            </div>
        </div>
    )
}