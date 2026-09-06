import React, { useEffect, useState } from "react";
import {
  ModalContainer,
  ModalHeader,
  ModalFooter,
  AlarmSoundSelect,
  SoundPreviewButton,
  VolumeControl,
} from "../../../Shared/Utils/ModalUtils";
import { useThemeStore } from "../../../Shared/Stores/ThemeStore";
import { DEFAULT_VOLUME } from "../../../Shared/Constants/Sounds";

const TimerEditModal = ({ isOpen, onClose, onSuccess, initialTimer }) => {
  const { isDark } = useThemeStore();

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("05");
  const [seconds, setSeconds] = useState("00");
  const [selectedSound, setSelectedSound] = useState("music1");
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    if (!isOpen && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  }, [isOpen, currentAudio]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

    if (totalSeconds < 1) {
      alert("최소 1초 이상 설정해주세요.");
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    onSuccess({
      duration: totalSeconds,
      sound: selectedSound,
      volume: volume,
      isMuted: isMuted,
    });
    onClose();
  };

  const handleTimeChange = (type, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);

    switch (type) {
      case "hours":
        setHours(Math.min(23, numValue).toString().padStart(2, "0"));
        break;
      case "minutes":
        setMinutes(Math.min(59, numValue).toString().padStart(2, "0"));
        break;
      case "seconds":
        setSeconds(Math.min(59, numValue).toString().padStart(2, "0"));
        break;
    }
  };

  const handlePreviewToggle = () => {
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setIsPlaying(false);
    } else {
      const audio = new Audio(`/sounds/${selectedSound}.mp3`);
      audio.volume = isMuted ? 0 : volume;
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const volumeValue =
      typeof newVolume === "number"
        ? newVolume
        : parseFloat(newVolume.target.value);
    setVolume(volumeValue);
    if (currentAudio && !isMuted) {
      currentAudio.volume = volumeValue;
    }
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (currentAudio) {
      currentAudio.volume = newMutedState ? 0 : volume;
    }
  };

  return (
    <>
      <ModalContainer isOpen={isOpen}>
        <ModalHeader title="새 타이머 추가" onClose={onClose} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium">타이머 설정</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-center mb-1">시</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className={`w-full px-3 py-2 text-center rounded border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-center mb-1">분</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className={`w-full px-3 py-2 text-center rounded border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-center mb-1">초</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => handleTimeChange("seconds", e.target.value)}
                  className={`w-full px-3 py-2 text-center rounded border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-12">
              <AlarmSoundSelect
                value={selectedSound}
                onChange={(e) => setSelectedSound(e.target.value)}
                className="flex-1"
              />
              <SoundPreviewButton
                isPlaying={isPlaying}
                onTogglePreview={handlePreviewToggle}
                isDark={isDark}
              />
            </div>

            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
              isMuted={isMuted}
              onMuteToggle={handleMuteToggle}
            />
          </div>
          <ModalFooter
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitText="타이머 설정"
            isLoading={false}
          />
        </form>
      </ModalContainer>
    </>
  );
};

export default TimerEditModal;
