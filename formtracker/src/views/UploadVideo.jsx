import React from 'react';
import { useLocation } from "react-router-dom";
import FileInput from '../components/FileInput';
export default function UploadVideo() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const exercise = params.get("exercise");
    return (
        <div>
            <FileInput />
            <p>{exercise}</p>
        </div>
    )
}