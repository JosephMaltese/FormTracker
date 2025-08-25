import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { session, loginUser } = UserAuth();
    const navigate = useNavigate();

    const handleFocus = () => {
        setError('');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const result = await loginUser(email, password);

            if (result.success) {
                navigate('/');
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-7">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Sign in to your FormTracker account
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                onFocus={handleFocus}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="email"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                onFocus={handleFocus}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="password"
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-gray-950 hover:bg-gray-600 text-white font-medium py-2.5 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            size="lg"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="text-blue-600 dark:text-white hover:text-blue-700 dark:hover:text-gray-400 font-medium underline-offset-2 hover:underline transition-colors duration-200"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}