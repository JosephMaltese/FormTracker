import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import FileInput from '../components/FileInput';
export default function UploadVideo() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const exercise = params.get("exercise");
    const [recording, setRecording] = useState(false);
    
    function handleRecordClick() {
        setRecording(true)
    }

    return (
        <div className='flex flex-col items-center'>
            {
                recording ? (
                    <div>Recording Video...</div>

                ) : (
                    <FileInput />
                )
            }
            <button onClick={handleRecordClick}>Record</button>
            <p>{exercise}</p>
        </div>
    )
}