import React, { useState, useEffect } from 'react';

const ProgressBar = ({ color = 'bg-blue-500', borderColor = 'border-blue-500' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalLoadingTime = 90 * 1000; // 90 seconds in milliseconds
    const intervalTime = totalLoadingTime / 100; // interval time to increment by 1%

    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const nextProgress = prevProgress + 1;
        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start w-full max-w-md mt-10">
      <div className="text-2xl mb-2">Loading Pitch Deck {progress}%</div>
      <div className={`w-full h-8 border-4 ${borderColor} rounded-full p-1`}>
        <div
          className={`${color} h-full rounded-full transition-all duration-100`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;