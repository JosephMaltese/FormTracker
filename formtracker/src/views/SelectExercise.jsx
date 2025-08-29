import React, { useState } from 'react';
import ExerciseCarousel from "../components/ui/exerciseCarousel";
import MenuButton from "../components/ui/menuButton";
import Navbar from '../components/ui/navbar';
export default function SelectExercise() {
    const [selectedExercise, setSelectedExercise] = useState('BENCH PRESS');
    return (
        <div className='h-screen flex flex-col justify-between text-center'>
            <div className='flex flex-col h-full'>
                <Navbar/>
            
                <h1 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-3'>
                            Select an Exercise
                </h1>
                <div className='flex justify-center h-full'>
                    <ExerciseCarousel onSelect={setSelectedExercise} />
                </div>

            </div>
            
            <div className='flex-shrink-0 flex flex-row w-full justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700'>
                <MenuButton text="Previous page" link="/" />
                <MenuButton text="Confirm Selection" link={`/upload-video?exercise=${encodeURIComponent(selectedExercise)}`} />
            </div>
        </div>
    )
}