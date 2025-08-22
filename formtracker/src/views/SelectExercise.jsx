import React from 'react';
import ExerciseCarousel from "../components/ui/exerciseCarousel"
export default function SelectExercise() {
    return (
        <div className='h-screen flex flex-col justify-center text-center'>
            <h1 className='text-5xl font-bold mt-8'>Select an Exercise to Analyze</h1>
            <div className='m-auto'>
                <ExerciseCarousel />
            </div>
        </div>
    )
}