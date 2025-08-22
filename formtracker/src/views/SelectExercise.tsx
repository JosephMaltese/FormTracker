import React, { useState } from 'react';
import ExerciseCarousel from "../components/ui/exerciseCarousel";
import MenuButton from "../components/ui/menuButton";
export default function SelectExercise() {
    const [selectedExercise, setSelectedExercise] = useState<string>('BENCH PRESS');
    return (
        <div className='h-screen flex flex-col justify-center text-center'>
            <h1 className='text-5xl font-bold mt-8'>Select an Exercise to Analyze</h1>
            <div className='m-auto flex justify-center'>
                <ExerciseCarousel onSelect={setSelectedExercise} />
            </div>
            <div className='flex flex-row justify-between px-2 pb-2'>
                <MenuButton text="< Previous page" link="/" />
                <MenuButton text="Confirm Selection >" link={`/upload-video?exercise=${encodeURIComponent(selectedExercise)}`} />
            </div>
        </div>
    )
}