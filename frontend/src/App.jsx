import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useThemeStore } from "./Shared/Stores/ThemeStore";
import { Toaster } from 'sonner';
import { getToasterProps } from './Shared/Utils/SonnerUtils';

import Sidebar from "./Layout/Sidebar";
import Alarm from "./Features/Alarm/Pages/Alarm";
import Timer from "./Features/Timer/Pages/Timer";
import Stopwatch from "./Features/Stopwatch/Pages/Stopwatch";
import Settings from "./Features/Settings/Pages/Settings";

function Layout() {
  const { isDark } = useThemeStore();

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
      {/* <Toaster
        position="bottom-right"
        richColors
        theme={isDark ? "dark" : "light"}
      /> */}
      <Toaster {...getToasterProps(isDark)} />
    </div>
  );
}
