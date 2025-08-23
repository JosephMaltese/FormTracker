import React from 'react';
import { Link } from 'react-router-dom';

function Home () {
    return (
        <div className='mt-20'>
            <h1>Form Tracker</h1>
            <div>
                <Link to="/select-exercise">Analyze an Exercise</Link>
            </div>
        </div>
    )
}

export default Home;