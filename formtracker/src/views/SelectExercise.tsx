import React, { useState } from 'react';
import ExerciseCarousel from "../components/ui/exerciseCarousel";
import MenuButton from "../components/ui/menuButton";
export default function SelectExercise() {
    const [selectedExercise, setSelectedExercise] = useState<string>('BENCH PRESS');
    return (
        <div className='h-screen flex flex-col justify-center text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
            <h1 className='text-5xl font-bold mt-16 dark:text-white'>Select an Exercise to Analyze</h1>
            <div className='m-auto flex justify-center'>
                <ExerciseCarousel onSelect={setSelectedExercise} />
            </div>
            <div className='flex flex-row justify-between px-5 mb-5'>
                <MenuButton text="< Previous page" link="/" />
                <MenuButton text="Confirm Selection >" link={`/upload-video?exercise=${encodeURIComponent(selectedExercise)}`} />
            </div>
        </div>
    )
}