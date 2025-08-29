import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const { videoFile, exercise } = location.state as { videoFile: File; exercise: string };

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
                const data = await res.json();
                console.log(data);

            } catch (err) {
                console.error("Failed to fetch results from backend:", err);
            }
        };

        fetchResults();
    }, [])
    return (
        <div>
            <p>{exercise}</p>
            <p>{videoFile.name}</p>
        </div>
    )
}