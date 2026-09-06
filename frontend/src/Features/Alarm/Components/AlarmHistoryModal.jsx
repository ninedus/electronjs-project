import React, { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "../../../Shared/Stores/ThemeStore";
import { useAlarmStore } from "../../../Shared/Stores/AlarmStore";
import {
  ModalContainer,
  ModalHeader,
  AlarmSoundSelect,
} from "../../../Shared/Utils/ModalUtils";
import { ITEMS_PER_PAGE } from "../../../Shared/Constants/Sounds";

const AlarmHistoryModal = ({ isOpen, onClose }) => {
  const { isDark, is24Hour } = useThemeStore();
  const { alarms, updateAlarm, deleteAlarm } = useAlarmStore();

  const [alarmHistory, setAlarmHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadAlarmHistory = useCallback(() => {
    try {
      setAlarmHistory(
        [...alarms].sort((a, b) => a.created_at.localeCompare(b.created_at))
      );
    } catch (error) {
      console.error("알람 기록을 불러오는데 실패했습니다:", error);
    }
  }, [alarms]);

  useEffect(() => {
    if (isOpen) loadAlarmHistory();
  }, [isOpen, loadAlarmHistory]);

  const totalPages = Math.ceil(alarmHistory.length / ITEMS_PER_PAGE);
  const currentAlarms = alarmHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = async (alarmId, isActive) => {
    try {
      updateAlarm(alarmId, { is_active: !isActive });
      loadAlarmHistory();
    } catch (error) {
      console.error('알람 상태 변경에 실패했습니다:', error);
    }
  };

  const handleDeleteAlarm = async (alarmId) => {
    if (!window.confirm("이 알람을 삭제하시겠습니까?")) return;

    try {
      deleteAlarm(alarmId);
      loadAlarmHistory();
    } catch (error) {
      console.error("알람 삭제에 실패했습니다:", error);
    }
  };

  const formatTimeWithSeconds = (time) => {
    if (!time) return "";

    const [hours, minutes, seconds] = time.split(":");
    const hour = parseInt(hours, 10);

    if (is24Hour) {
      return `${hours}:${minutes}:${seconds}`;
    }

    const period = hour >= 12 ? "오후" : "오전";
    const displayHour = hour % 12 || 12;
    return `${period} ${displayHour}:${minutes}:${seconds}`;
  };

  const renderAlarmList = () => (
    <>
      <table className="w-full border-collapse">
        <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
          <tr>
            <th className="px-4 py-2 text-left border-b">시간</th>
            <th className="px-4 py-2 text-left border-b">알람음</th>
            <th className="px-4 py-2 text-center border-b">상태</th>
            <th className="px-4 py-2 text-center border-b">삭제</th>
          </tr>
        </thead>
        <tbody className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {currentAlarms.map((alarm) => (
            <tr
              key={alarm.id}
              className={`border-b ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            >
              <td className="px-4 py-2">
                {formatTimeWithSeconds(alarm.alarm_time)}
              </td>
              <td className="px-4 py-2">
                {alarm.sound_type === "custom" ? (
                  <span title={alarm.sound_source}>
                    {alarm.sound_name || "사용자 음원"}
                  </span>
                ) : (
                  <AlarmSoundSelect
                    value={alarm.sound_id}
                    onChange={(e) =>
                      updateAlarm(alarm.id, { sound_id: e.target.value })
                    }
                  />
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={alarm.is_active}
                  onChange={() => handleStatusToggle(alarm.id, alarm.is_active)}
                  className={`w-4 h-4 rounded-full appearance-none cursor-pointer transition-all duration-200 ease-in-out
                    ${
                      isDark
                        ? "bg-gray-600 border-gray-500"
                        : "bg-gray-200 border-gray-300"
                    } 
                    border-2
                    checked:border-blue-500
                    checked:bg-blue-500
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                    ${alarm.is_active ? "bg-blue-500 border-blue-500" : ""}`}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleDeleteAlarm(alarm.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <span
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          총 {alarmHistory.length}개 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          -{Math.min(currentPage * ITEMS_PER_PAGE, alarmHistory.length)}개
        </span>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8 text-gray-500">알람 기록이 없습니다.</div>
  );
  return (
    <>
      <ModalContainer isOpen={isOpen} maxWidth="4xl">
        <ModalHeader title="알람 기록" onClose={onClose} />

        {alarmHistory.length > 0 ? renderAlarmList() : renderEmptyState()}
      </ModalContainer>
    </>
  );
};

export default AlarmHistoryModal;
