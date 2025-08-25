import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function Home () {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();
    console.log(session);

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate('/signup');
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className='mt-20'>
            <h1>Form Tracker</h1>
            <h2>Welcome, {session?.user?.email}</h2>
            <div>
                <Link to="/select-exercise">Analyze an Exercise</Link>
            </div>
            <div>
                <p onClick={handleSignOut} className='hover:cursor-pointer border inline-block px-4 py-3 mt-4'>Sign out</p>
            </div>
        </div>
    )
}

export default Home;