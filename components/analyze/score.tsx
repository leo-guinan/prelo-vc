// Define the types for the component props
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

interface CircularProgressBarProps {
    progress: number;
    title: string;
    overrideColor?: string;
}

export function CircularProgressBar({progress, title, overrideColor}: CircularProgressBarProps) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const [currentProgress, setCurrentProgress] = useState(0);
    const requestRef = useRef<number>();
    const innerRadius = 40;
    const color = progress > 70 ? '#5CE1E6' : progress > 40 ? '#FFCC2F' : '#FF9494';
    const theme = useTheme()
    useEffect(() => {
        const duration = 1000; // Total duration of the animation in milliseconds
        const frameRate = 10; // Duration between frames in milliseconds
        const totalFrames = duration / frameRate;
        const incrementPerFrame = progress / totalFrames;

        let frameCount = 0;
        const frame = () => {
            frameCount++; // Increment the number of frames
            const updatedProgress = incrementPerFrame * frameCount;
            setCurrentProgress(updatedProgress);

            if (frameCount < totalFrames) {
                requestRef.current = window.requestAnimationFrame(frame);
            } else {
                // Ensure we set the exact final progress and avoid floating point issues
                setCurrentProgress(progress);
            }
        };

        // Start the animation
        requestRef.current = window.requestAnimationFrame(frame);

        return () => {
            if (requestRef.current) {
                window.cancelAnimationFrame(requestRef.current);
            }
        };
    }, [progress]);

    // Calculate the stroke dash offset
    const strokeDashoffset = circumference - (circumference * (currentProgress / 100));
    // Function to determine text color based on background color
    const getTextColor = (bgColor: string) => {
        // This is a very basic way to determine if the color is light or dark.
        // More sophisticated methods might involve calculating luminance.
        const color = bgColor.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    };

    const textColor = getTextColor(overrideColor || color);

    const titleColor = overrideColor ?? color;

    return (
        <div className="flex flex-col items-center flex-0 p-2 w-[200px] sm:w-[100px]">
            <div
                className={cn("flex text-sm font-semibold uppercase tracking-wider text-center whitespace-nowrap items-center mb-4", overrideColor ? "dark:text-zinc-50" : "")}
                style={{color: titleColor, height: "40px"}}>
                {title}
            </div>
            <div className="relative" style={{width: '100%', paddingTop: '100%'}}>
                <svg width="120" height="120" className="absolute top-0 left-0 size-full" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={`${overrideColor ?? color}20`} // Background circle
                        strokeWidth="10"
                        strokeOpacity="0.2"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={overrideColor ?? color}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 60 60)"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={innerRadius}
                        fill={overrideColor ?? color} // Use the same color as the progress bar
                    />
                    <text
                        x="50%"
                        y="50%"
                        dy=".3em"
                        textAnchor="middle"
                        fontSize="20"
                        fill={textColor}
                    >
                        {Math.round(currentProgress)}%

                    </text>
                </svg>
            </div>
        </div>
    );
};

