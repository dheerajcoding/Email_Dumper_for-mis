import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="spinner mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
