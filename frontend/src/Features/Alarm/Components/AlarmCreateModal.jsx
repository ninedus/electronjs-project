import React, { useEffect, useState } from "react";
import { useThemeStore } from "../../../Shared/Stores/ThemeStore";
import { useAlarmStore } from "../../../Shared/Stores/AlarmStore";
import {
  ModalContainer,
  ModalHeader,
  AlarmSoundSelect,
  SoundPreviewButton,
  VolumeControl,
  ModalFooter,
  getCurrentTime,
} from "../../../Shared/Utils/ModalUtils";
import { DEFAULT_VOLUME, getAlarmSoundSource } from "../../../Shared/Constants/Sounds";
import { AlarmToasts } from "../../../Shared/Utils/SonnerUtils";

const AlarmCreateModal = ({ isOpen, onClose }) => {
  const { isDark } = useThemeStore();
  const { createAlarm, isLoading, currentAudio, setCurrentAudio } =
    useAlarmStore();

  const [alarmTime, setAlarmTime] = useState(getCurrentTime());
  const [selectedSound, setSelectedSound] = useState("music1");
  const [soundType, setSoundType] = useState("preset");
  const [customSoundSource, setCustomSoundSource] = useState("");
  const [customSoundName, setCustomSoundName] = useState("");
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClose = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soundType === "custom" && !customSoundSource) {
      AlarmToasts.error("MP3 파일을 선택하거나 오디오 URL을 입력해주세요.");
      return;
    }

    try {
      await createAlarm({
        alarm_time: alarmTime,
        sound_id: selectedSound,
        sound_type: soundType,
        sound_source: soundType === "custom" ? customSoundSource : null,
        sound_name: soundType === "custom" ? customSoundName : null,
        volume: isMuted ? 0 : volume,
        is_active: true
      });
      handleClose();
      AlarmToasts.created(alarmTime);
    } catch (err) {
      console.error('알람 생성 실패:', err);
      AlarmToasts.error('알람 생성에 실패했습니다.');
    }
  };

  const handleCustomFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCustomSoundSource(reader.result);
      setCustomSoundName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSoundTypeChange = (type) => {
    setSoundType(type);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  };

  const handlePreviewToggle = () => {
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setIsPlaying(false);
    } else {
      const audio = new Audio(getAlarmSoundSource({
        sound_type: soundType,
        sound_id: selectedSound,
        sound_source: customSoundSource,
      }));
      audio.volume = isMuted ? 0 : volume;
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const volumeValue = typeof newVolume === 'number' ? newVolume : parseFloat(newVolume.target.value);
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

  useEffect(() => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  }, [selectedSound, soundType, customSoundSource]);

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
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />

            <div className="flex gap-2">
              <select
                value={soundType}
                onChange={(e) => handleSoundTypeChange(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="preset">기본 알람음</option>
                <option value="custom">내 음악</option>
              </select>
              {soundType === "preset" ? (
                <AlarmSoundSelect
                  value={selectedSound}
                  onChange={(e) => setSelectedSound(e.target.value)}
                  className="flex-1"
                />
              ) : (
                <input
                  type="url"
                  value={customSoundSource.startsWith("data:") ? "" : customSoundSource}
                  onChange={(e) => {
                    setCustomSoundSource(e.target.value);
                    setCustomSoundName(e.target.value);
                  }}
                  placeholder="오디오 URL 입력"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              )}
              <SoundPreviewButton
                isPlaying={isPlaying}
                onTogglePreview={handlePreviewToggle}
                isDark={isDark}
              />
            </div>

            {soundType === "custom" && (
              <label className={`block text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                또는 MP3 파일 선택
                <input
                  type="file"
                  accept="audio/*,.mp3"
                  onChange={handleCustomFileChange}
                  className="block w-full mt-1 text-sm"
                />
                {customSoundName && (
                  <span className="block mt-1 truncate">선택됨: {customSoundName}</span>
                )}
              </label>
            )}

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
