import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import { useThemeStore } from "./Shared/Stores/ThemeStore";
import { Toaster } from 'sonner';
import { getToasterProps } from './Shared/Utils/SonnerUtils';
import RingModal from './Modal/RingModal';
import { useAlarmStore } from './Shared/Stores/AlarmStore';
import { useTimerStore } from './Shared/Stores/TimerStore';
import { useEffect } from 'react';

import Sidebar from "./Layout/Sidebar";
import Alarm from "./Features/Alarm/Pages/Alarm";
import Timer from "./Features/Timer/Pages/Timer";
import Stopwatch from "./Features/Stopwatch/Pages/Stopwatch";
import Settings from "./Features/Settings/Pages/Settings";

function Layout() {
  const { isDark } = useThemeStore();
  const { ringingAlarm, isRinging, stopAlarm, checkAlarms } = useAlarmStore();
  const { isCompleted, sound, resetCompleted } = useTimerStore();
  const navigate = useNavigate();
  
  const handleAlarmClose = () => {
    stopAlarm();
  };

  const handleTimerClose = () => {
    resetCompleted();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      checkAlarms();
    }, 1000);

    return () => clearInterval(timer);
  }, [checkAlarms]);

  useEffect(() => {
    if (isRinging || isCompleted) {
      if (window.electron) {
        window.electron.focusWindow();
      }
      if (isRinging) {
        navigate('/');
      } else if (isCompleted) {
        navigate('/timer');
      }
    }
  }, [isRinging, isCompleted, navigate]);

  return (
    <div
      className={`flex-1 flex overflow-hidden ${
        isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-blue-500"
      }`}
    >
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <RingModal
        isOpen={isRinging}
        onClose={handleAlarmClose}
        alarm={ringingAlarm}
        type="alarm"
      />
      <RingModal
        isOpen={isCompleted}
        onClose={handleTimerClose}
        alarm={{ sound_id: sound }}
        type="timer"
      />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Alarm /> },
      { path: "/timer", element: <Timer /> },
      { path: "/stopwatch", element: <Stopwatch /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

export default function App() {
  const { isDark } = useThemeStore();

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster {...getToasterProps(isDark)} />
    </div>
  );
}
