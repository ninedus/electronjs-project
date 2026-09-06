import React from 'react';
import { HiMoon, HiSun } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { PageContainer } from '../../../Shared/Components/Layout';
import { PrimaryButton } from '../../../Shared/Components/Buttons';
import { useThemeStore } from "../../../Shared/Stores/ThemeStore";

const Settings = () => {
  const { 
    isDark, 
    setIsDark, 
    is24Hour, 
    setIs24Hour,
  } = useThemeStore();

  return (
    <PageContainer centered={false} className="overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">설정</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`p-6 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-xl font-semibold mb-4">테마 설정</h2>
          <div className="flex items-center justify-between">
            <span>다크 모드</span>
            <PrimaryButton
              onClick={() => setIsDark(!isDark)}
              color="indigo"
              size="sm"
              icon={isDark ? <HiMoon className="w-6 h-6" /> : <HiSun className="w-6 h-6" />}
            />
          </div>
        </div>

        <div className={`p-6 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-xl font-semibold mb-4">시간 표시 형식</h2>
          <div className="flex items-center justify-between">
            <span>24시간제</span>
            <PrimaryButton
              onClick={() => setIs24Hour(!is24Hour)}
              color={is24Hour ? "purple" : "gray"}
              size="sm"
              icon={<BiTime className="w-6 h-6" />}
            />
          </div>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            현재 설정: {is24Hour ? '24시간제' : '오전/오후'}
          </p>
        </div>
        <div className="pb-8"></div>
      </div>
    </PageContainer>
  );
}

export default Settings;