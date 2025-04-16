'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TimeBasedPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 7 && hour < 12) {
      greeting = '🍞 Cocina abierta para tostadas y desayunos ligeros.';
    } else if (hour >= 12 && hour < 18) {
      greeting = '🍽️ Cocina abierta para comidas completas.';
    } else {
      greeting = '❌ Cocina cerrada.';
    }

    setMessage(greeting);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {message}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimeBasedPopup; 