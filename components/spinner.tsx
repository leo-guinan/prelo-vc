import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = 'text-blue-500' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
      xl: 'w-16 h-16',
      xxl: 'w-20 h-20',
      xxxl: 'w-24 h-24',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} ${color} animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;