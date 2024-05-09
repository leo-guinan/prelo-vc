import {useEffect, useRef} from "react";

interface CircularProgressBarProps {
    color: string;
    title: string;
}

export function LoadingProgressCircle({color, title}: CircularProgressBarProps) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const requestRef = useRef<number>();

    useEffect(() => {
        // Continuous rotation animation using CSS
        requestRef.current = requestAnimationFrame(() => {
            // Additional logic or state updates can be handled here if needed
        });

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    // Function to determine text color based on background color
    const getTextColor = (bgColor: string) => {
        const color = bgColor.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    };

    const textColor = getTextColor(color);
    return (
        <div className="flex flex-col items-center">
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: color }}>
                {title}
            </div>
            <svg width="120" height="120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={`${color}20`}
                    strokeWidth="10"
                    strokeOpacity="0.2"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    transform="rotate(-90 60 60)"
                    style={{
                        transition: "stroke-dashoffset 0.35s",
                        transformOrigin: "center",
                        animation: "spin 2s linear infinite"
                    }}
                />
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill={color}
                />
                <text
                    x="50%"
                    y="50%"
                    dy=".3em"
                    textAnchor="middle"
                    fontSize="20"
                    fill={textColor}
                >
                    Loading...
                </text>
            </svg>
        </div>
    );
}