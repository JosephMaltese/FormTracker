import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Spinner } from '../components/ui/shadcn-io/spinner';

export default function Results() {
    const location = useLocation();
    const { videoFile, exercise } = location.state as { videoFile: File; exercise: string };
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const formData = new FormData();
                formData.append("file", videoFile);
                formData.append("exercise", exercise);
                const res = await fetch("http://127.0.0.1:8000/analyze-video/", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                console.log("Successfully fetched results");
                setScore(res.headers.get("total_score"));
                const data = await res.blob();
                setUrl(URL.createObjectURL(data));
                setLoading(false);
                

            } catch (err) {
                console.error("Failed to fetch results from backend:", err);
            }
        };

        fetchResults();
    }, [])
    return (
        loading ? (
            <div className='flex flex-col justify-center items-center h-screen'>
                <p className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-3'>Analyzing Video</p>
                <Spinner variant='ellipsis' className='text-white' size={128}/>
            </div>
        ) : (
        <div>
            <h2>Form Analysis Results</h2>
            {score && <h3>Overall Score: {score}</h3>}
            <h4>Exercise: <span>{exercise}</span></h4>
            <video
                src={url ? url : ''}
                    controls
                    className="w-full h-full object-contain rounded-lg shadow-lg"
            />
            
            <p>{videoFile.name}</p>
        </div>
        )
    )
}