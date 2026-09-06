import React, { useState } from "react";
import { useThemeStore } from "../../../Shared/Stores/ThemeStore";
import { ModalContainer, ModalHeader, AlarmSoundSelect, SoundPreviewButton, VolumeControl, ModalFooter } from "../../../Shared/Utils/ModalUtils";

const AlarmCreateModal = ({ isOpen, onClose }) => {
  const { isDark } = useThemeStore();

  const [alarmTime, setAlarmTime] = useState();
  const [selectedSound, setSelectedSound] = useState('music1');
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      handleClose();
    } catch (err) {
      console.error("알람 생성 실패:", err);
    }
  };

  const handlePreviewToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      const audio = new Audio(`/sounds/${selectedSound}.mp3`);
      audio.volume = isMuted ? 0 : volume;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (currentAudio && !isMuted) {
      currentAudio.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
  };

  return (
    <>
      <ModalContainer isOpen={isOpen}>
        <ModalHeader title="새 알람 추가" onClose={handleClose} />

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              step="1"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />

            <div className="flex gap-2">
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
            onCancel={handleClose}
            onSubmit={handleSubmit}
            submitText="알람 설정"
            isLoading={false}
          />
        </form>
      </ModalContainer>
    </>
  );
};

export default AlarmCreateModal;
