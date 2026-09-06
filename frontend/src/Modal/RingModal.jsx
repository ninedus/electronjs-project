import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../Shared/Stores/ThemeStore';
import { BiBell } from 'react-icons/bi';

const RingModal = ({ isOpen, onClose, alarm, type }) => {
  const { isDark } = useThemeStore();
  const audioRef = useRef(null);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && alarm) {
      audioRef.current = new Audio(`/sounds/${alarm.sound_id}.mp3`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen, alarm]);

  if (!isOpen || !alarm) return null;

  return (
    <div className={`
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      w-full max-w-md p-6 rounded-2xl z-50 shadow-xl
      ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    `}>
      <div className="flex flex-col items-center gap-6">
        <div className="animate-bounce">
          <BiBell className="w-16 h-16 text-blue-500" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {type === 'timer' ? '타이머 종료!' : '알람!'}
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {type === 'timer' 
              ? '타이머가 종료되었습니다' 
              : `${alarm.alarm_time} 알람이 울렸습니다`
            }
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default RingModal; 