'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  message: string;
}

const TimeBasedPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/time-slots');
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeSlots.length > 0) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      const activeSlot = timeSlots.find(slot => {
        return currentTimeString >= slot.startTime && currentTimeString <= slot.endTime;
      });

      setMessage(activeSlot ? activeSlot.message : '❌ Cocina cerrada.');
    }
  }, [timeSlots]);

  if (!isOpen || isLoading) return null;

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