import React from "react";
import { PageContainer } from "../../../Shared/Components/Layout";
import { RecordList, TimeDisplay } from "../../../Shared/Components/Display";
import { PrimaryButton } from "../../../Shared/Components/Buttons";
import { useStopwatchStore } from "../../../Shared/Stores/StopwatchStore";
import { useTimeFormat } from "../../../Shared/Hooks";
import { HiClock, HiPause, HiPlay, HiRefresh } from "react-icons/hi";

const Stopwatch = () => {
  const { StopwatchFormatTime } = useTimeFormat();
  const { currentTime, isRunning, records, start, stop, reset, addRecord } =
    useStopwatchStore();

  const handleStartStop = () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleRecord = () => {
    if (isRunning) {
      addRecord();
    }
  };

  return (
    <PageContainer>
      <div className="text-center space-y-8">
        <TimeDisplay
          time={StopwatchFormatTime(currentTime)}
          size="xl"
          showMilliseconds={true}
        />

        <div className="flex space-x-4 justify-center">
          <PrimaryButton
            onClick={handleStartStop}
            color={isRunning ? "red" : "green"}
            icon={
              isRunning ? (
                <HiPause className="w-5 h-5" />
              ) : (
                <HiPlay className="w-5 h-5" />
              )
            }
          >
            {isRunning ? "정지" : "시작"}
          </PrimaryButton>
          <PrimaryButton
            onClick={handleRecord}
            disabled={!isRunning}
            color="blue"
            icon={<HiClock className="w-5 h-5" />}
          >
            기록
          </PrimaryButton>
          <PrimaryButton
            onClick={handleReset}
            color={"gray"}
            icon={<HiRefresh className="w-5 h-5" />}
          >
            초기화
          </PrimaryButton>
        </div>

        {records.length > 0 && (
          <div className="flex justify-center">
            <RecordList
              records={records}
              formatFunction={StopwatchFormatTime}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Stopwatch;
