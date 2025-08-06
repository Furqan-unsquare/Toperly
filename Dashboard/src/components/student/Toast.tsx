import React from 'react';

const Toast = ({ message }) => {
  if (!message) return null;
  const color = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[message.type];

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${color}`}>
      {message.text}
    </div>
  );
};

export default Toast;
