import React from 'react';
import { Link } from 'react-router-dom';

function MenuButton ({ text, link }: { text: string, link: string }) {
    return (
        <div className='bg-gray-700 inline-block p-4 rounded-lg hover:cursor-pointer'>
            <Link to={link} className='text-white text-lg font-semibold'>{text}</Link>
        </div>
    )
}

export default MenuButton