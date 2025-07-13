// src/components/LoadingSpinner.tsx
"use client";

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  message = 'Processing...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`${sizeClasses[size]} border-t-4 border-blue-500 rounded-full animate-spin`}></div>
      {message && (
        <div className="mt-4 text-gray-600 text-center">
          {message}
        </div>
      )}
    </div>
  );
}