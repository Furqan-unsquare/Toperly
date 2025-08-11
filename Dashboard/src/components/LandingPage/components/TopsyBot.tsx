import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

const TopsyBot = () => {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000); // Wave for 2 seconds
    }, 5000); // Repeat every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="flex items-center justify-center bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minWidth: '56px',
          minHeight: '56px',
        }}
      >
        <motion.div
          className="flex items-center space-x-2"
          animate={{
            rotate: isWaving ? [0, -15, 15, 0] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            times: [0, 0.25, 0.75, 1],
            repeat: isWaving ? 1 : 0,
          }}
        >
          <Hand className="w-6 h-6 text-white" />
          <span className="text-sm font-medium hidden md:inline">Hey! Use me!</span>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default TopsyBot;