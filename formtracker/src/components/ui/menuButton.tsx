import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function MenuButton({ text, link }: { text: string, link: string }) {
    // Determine if this is a "previous" or "next" button based on text content
    const isPrevious = text.toLowerCase().includes('previous') || text.includes('<');
    const isNext = text.toLowerCase().includes('next') || text.toLowerCase().includes('confirm') || text.includes('>');
    
    // Choose appropriate icon and styling based on button type
    const Icon = isPrevious ? ArrowLeft : isNext ? ArrowRight : null;
    
    return (
        <Link to={link}>
            <Button 
                variant="outline" 
                size="lg"
                className={`
                    h-12 px-6 text-base font-semibold transition-all duration-300 dark:text-white
                    ${isPrevious 
                        ? 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 border-blue-200 dark:border-blue-700' 
                        : isNext 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                `}
            >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {text}
            </Button>
        </Link>
    );
}

export default MenuButton;