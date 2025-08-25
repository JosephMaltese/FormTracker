import React from "react";
import { Button } from './button';
import { Target } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate

 } from "react-router-dom";
export default function Navbar() {

    const { signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate('/signup');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FormTracker</h1>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:text-white"
                >
                    Sign out
                </Button>
        </div>
    )
}