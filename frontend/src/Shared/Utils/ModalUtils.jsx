import React, { useEffect } from "react";
import { useThemeStore } from "../Stores/ThemeStore";
import { ALARM_SOUNDS } from "../Constants/Sounds";

export const ModalContainer = ({ isOpen, children }) => {
  const { isDark } = useThemeStore();

  return (
    <div
      className={`
        fixed inset-0 z-10 overflow-y-auto transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative max-w-5xl w-full mx-auto rounded-lg shadow-xl
            ${isDark ? "bg-gray-800" : "bg-white"}
            p-6 transform transition-all duration-300
            ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const CloseButton = ({ onClose }) => {
  const { isDark } = useThemeStore();

  return (
    <button
      onClick={onClose}
      className={`p-1 rounded-full hover:bg-opacity-20 ${
        isDark ? "hover:bg-gray-300" : "hover:bg-gray-200"
      }`}
    >
      <svg
        className={`w-6 h-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
};

export const ModalHeader = ({ title, onClose }) => {
  const { isDark } = useThemeStore();

  return (
    <div className="flex justify-between items-start mb-4">
      <h2
        className={`text-xl font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      <CloseButton onClose={onClose} />
    </div>
  );
};

export const AlarmSoundSelect = ({ value, onChange, className }) => {
  const { isDark } = useThemeStore();
  return (
    <select
      value={value}
      onChange={onChange}
      className={`
        px-4 py-2 rounded-lg border
        ${
          isDark
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors
        ${className}
      `}
    >
      {ALARM_SOUNDS.map((sound) => (
        <option key={sound.id} value={sound.id}>
          {sound.name}
        </option>
      ))}
    </select>
  );
};

export const SoundPreviewButton = ({ isPlaying, onTogglePreview, isDark }) => (
  <button
    type="button"
    onClick={onTogglePreview}
    className={`px-4 rounded-lg ${
      isDark
        ? isPlaying
          ? "bg-gray-600 text-gray-200"
          : "bg-blue-500 text-white"
        : isPlaying
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`}
  >
    {isPlaying ? "중지" : "미리듣기"}
  </button>
);

export const VolumeControl = ({
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
}) => {
  const { isDark } = useThemeStore();

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className={`
          flex-1 h-2 rounded-lg appearance-none cursor-pointer
          ${isDark ? "bg-gray-700" : "bg-gray-200"}
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-500
          [&::-webkit-slider-thumb]:cursor-pointer
        `}
      />
      <button
        type="button"
        onClick={onMuteToggle}
        className={`p-2 rounded-lg ${
          isDark
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-200 text-gray-600"
        }`}
      >
        {isMuted ? <MuteIcon /> : <VolumeIcon />}
      </button>
    </div>
  );
};

// 볼륨 아이콘
export const VolumeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 8v8l-4-4H4V12h4l4-4z" />
  </svg>
);

// 음소거 아이콘
export const MuteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

export const ModalFooter = ({
  onCancel,
  onSubmit,
  submitText = "확인",
  isLoading = false,
}) => {
  const { isDark } = useThemeStore();

  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg ${
          isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        취소
      </button>
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={`px-4 py-2 rounded-lg bg-blue-500 text-white`}
      >
        {isLoading ? "저장 중..." : submitText}
      </button>
    </div>
  );
};

export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
};
