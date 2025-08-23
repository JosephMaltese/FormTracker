import React from 'react';
import { useLocation } from "react-router-dom";

export default async function Results() {
    const location = useLocation();
    const { videoFile, exercise } = location.state as { videoFile: File; exercise: string };
    return (
        <div>
            <p>{exercise}</p>
            <p>{videoFile.name}</p>
        </div>
    )
}