'use client'
import React, {useEffect, useState} from 'react';

const ChatMessageLoading = ({circleColors}: {circleColors: string[]}) => {
    const [currentColors, setCurrentColors] = useState<string[]>([]);
    useEffect(() => {
        setCurrentColors(circleColors);
      }, [circleColors]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (currentColors.length > 1) {
                setCurrentColors(prevItems => {
                    const tempItems = [...prevItems]
                    const lastItem = tempItems.pop() as string; // Remove the last item
                    return [lastItem, ...tempItems]; // Add it to the front
                });
            }
        }, 500);

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, [currentColors]);
    return (
        <div className="ml-4 flex items-center space-x-2 w-full h-8">
            {currentColors.map((color, index) => (
                <div
                    key={index}
                    className={`${color} size-2 rounded-full`}
                />
            ))}
        </div>
    );
};

export default ChatMessageLoading;