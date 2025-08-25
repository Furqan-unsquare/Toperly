import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TopsyBot = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/topsy/1.png',
    '/topsy/2.png',
    '/topsy/3.png',
    '/topsy/4.png',
    '/topsy/5.png',
    '/topsy/6.png',
    '/topsy/7.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1500); // Change image every 1 second
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    window.open('https://chatgpt.com', '_blank');
  };

  return (
    <motion.div
      className="fixed bottom-2 right-2 z-50 drop-shadow-xl"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={handleClick}
        className="flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minWidth: '100px',
          minHeight: '100px',
          width: '48px',
          height: '48px',
        }}
      >
        <img
          src={images[currentIndex]}
          alt="Topsy"
          className="w-full h-full object-cover rounded-full"
        />
      </motion.button>
    </motion.div>
  );
};

export default TopsyBot;