import React, { useState } from 'react';
import ExerciseCarousel from "../components/ui/exerciseCarousel";
import MenuButton from "../components/ui/menuButton";
import Navbar from '../components/ui/navbar';
export default function SelectExercise() {
    const [selectedExercise, setSelectedExercise] = useState('BENCH PRESS');
    return (
        <div className='h-screen flex flex-col justify-center text-center'>
            <Navbar/>
             
            <h1 className='text-5xl font-bold my-8 dark:text-white'>Select an Exercise</h1>
            <div className='m-auto flex justify-center'>
                <ExerciseCarousel onSelect={setSelectedExercise} />
            </div>
            <div className='flex flex-row justify-between px-5 mb-5'>
                <MenuButton text="Previous page" link="/" />
                <MenuButton text="Confirm Selection" link={`/upload-video?exercise=${encodeURIComponent(selectedExercise)}`} />
            </div>
        </div>
    )
}