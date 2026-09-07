import React, { useState, useEffect } from "react";
import { HiPlus, HiClock } from "react-icons/hi";
import { PageContainer } from "../../../Shared/Components/Layout";
import { TimeDisplay, DateDisplay } from "../../../Shared/Components/Display";
import { PrimaryButton } from "../../../Shared/Components/Buttons";
import { useTimeFormat } from "../../../Shared/Hooks";
import { useAlarmStore } from "../../../Shared/Stores/AlarmStore";
import AlarmCreateModal from "../Components/AlarmCreateModal";
import AlarmHistoryModal from "../Components/AlarmHistoryModal";

const Alarm = () => {
  const { formatTime } = useTimeFormat();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1);

    return () => clearInterval(timer);
  }, []);

  return (
    <PageContainer>
      <div className="text-center space-y-8">
        <DateDisplay date={currentTime} />
        <TimeDisplay time={formatTime(currentTime, true)} size="xl" />

        <div className="flex gap-4 justify-center">
          <PrimaryButton
            onClick={() => setIsCreateModalOpen(true)}
            icon={<HiPlus className="w-6 h-6" />}
            size="lg"
            color="indigo"
          >
            알람 추가
          </PrimaryButton>

          <PrimaryButton
            onClick={() => setIsHistoryModalOpen(true)}
            icon={<HiClock className="w-6 h-6" />}
            size="lg"
            color="gray"
          >
            알람 목록
          </PrimaryButton>
        </div>
      </div>

      <AlarmCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <AlarmHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PageContainer>
  );
};

export default Alarm;
