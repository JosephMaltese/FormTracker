import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Activity, Target, Award, Play, BarChart3, Calendar, Zap } from 'lucide-react';
import Navbar from '../components/ui/navbar';

function Home() {
    const { session } = UserAuth();

    // Mock data for form tracking over time
    const formProgressData = [
        { date: 'Jan 1', score: 75, exercise: 'Squat' },
        { date: 'Jan 3', score: 78, exercise: 'Squat' },
        { date: 'Jan 5', score: 82, exercise: 'Squat' },
        { date: 'Jan 7', score: 85, exercise: 'Squat' },
        { date: 'Jan 9', score: 88, exercise: 'Squat' },
        { date: 'Jan 11', score: 90, exercise: 'Squat' },
        { date: 'Jan 13', score: 92, exercise: 'Squat' },
    ];

    const stats = [
        { title: 'Total Sessions', value: '24', icon: Activity, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'Best Score', value: '92%', icon: Award, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { title: 'Current Streak', value: '7 days', icon: Zap, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
        { title: 'Exercises Tracked', value: '3', icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Header */}
            <Navbar />

            <h2 className='text-white text-3xl font-bold mt-6 ml-8'>Welcome, {session?.user?.email}</h2>
            {/* Main Dashboard Content */}
            <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
                
                {/* Left Column - Stats */}
                <div className="space-y-6 flex flex-col">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <Card className="border-0 shadow-lg py-8">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <span className='dark:text-white'>Recent Activity</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Squat Analysis</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">92% form score - 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Bench Press Analysis</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">88% form score - 1 day ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Bicep Curl Analysis</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">85% form score - 2 days ago</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Center Column - Main Action */}
                <div className="flex flex-col justify-center items-center space-y-8">
                    {/* Welcome Message */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Ready to Perfect Your Form?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                            Track your progress, analyze your technique, and improve your performance with AI-powered form analysis.
                        </p>
                    </div>

                    {/* Main Action Button */}
                    <Link to="/select-exercise">
                        <Button 
                            size="lg" 
                            className="h-16 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Play className="w-6 h-6 mr-3" />
                            Start New Analysis
                        </Button>
                    </Link>

                    {/* Quick Actions */}
                    <div className="flex space-x-4">
                        <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <BarChart3 className="w-4 h-4 mr-2 dark:text-white" />
                            <span className='dark:text-white'>View History</span>
                        </Button>
                        <Button variant="outline" className="hover:bg-green-50 dark:hover:bg-green-900/20">
                            <TrendingUp className="w-4 h-4 mr-2 text-gray-900 dark:text-white" />
                            <span className='dark:text-white'>Progress Report</span>
                        </Button>
                    </div>
                </div>

                {/* Right Column - Form Progress Chart */}
                <div className="space-y-6 flex flex-col">
                    <Card className="border-0 shadow-lg py-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className='dark:text-white'>Form Progress</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={formProgressData}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis 
                                            dataKey="date" 
                                            className="text-xs"
                                            tick={{ fill: 'currentColor' }}
                                        />
                                        <YAxis 
                                            domain={[70, 100]}
                                            className="text-xs"
                                            tick={{ fill: 'currentColor' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3}
                                            fill="url(#colorScore)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your squat form has improved by <span className="font-semibold text-green-600">17%</span> this month!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exercise Distribution */}
                    <Card className="border-0 shadow-lg py-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold dark:text-white">Exercise Focus</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Squat</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">60%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Bench Press</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">25%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Bicep Curl</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">15%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Home;