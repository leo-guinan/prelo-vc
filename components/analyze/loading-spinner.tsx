'use client'
import {useEffect, useState} from "react";

interface LoadingSpinnerProps {
    steps: string[];
    currentStep: number;
}

export default function LoadingSpinner({steps, currentStep}: LoadingSpinnerProps) {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        // Update progress as the currentStep changes
        setProgress((currentStep / steps.length) * 100);
    }, [currentStep, steps.length]);

    return (
        <div className="space-y-4">
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span
                            className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Step {currentStep} of {steps.length}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round(progress)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{width: `${progress}%`}}
                         className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
            </div>
            {currentStep <= steps.length ? (
                <div className="flex justify-center items-center">
                    <div
                        style={{borderTopColor: 'transparent'}}
                        className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full animate-spin"
                    ></div>
                </div>
            ) : (
                <div className="text-center text-green-500">All steps completed!</div>
            )}
        </div>
    );
}