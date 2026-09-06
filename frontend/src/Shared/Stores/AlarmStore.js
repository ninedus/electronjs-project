import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAlarmStore = create(
  persist(
    (set, get) => ({
      alarms: [],
      isLoading: false,
      error: null,
      
      ringingAlarm: null,
      isRinging: false,
      
      currentAudio: null,
      volume: 0.7,
      isMuted: false,

      createAlarm: (alarmData) => {
        set({ isLoading: true, error: null });
        try {
          const newAlarm = {
            ...alarmData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            is_active: true,
            last_triggered: null
          };
          set((state) => ({ 
            alarms: [...state.alarms, newAlarm],
            isLoading: false 
          }));
          return newAlarm;
        } catch (error) {
          set({ error: '알람 생성에 실패했습니다.', isLoading: false });
          throw error;
        }
      },

      updateAlarm: (id, data) => {
        try {
          set((state) => ({
            alarms: state.alarms.map(alarm => 
              alarm.id === id ? { ...alarm, ...data } : alarm
            )
          }));
        } catch (error) {
          set({ error: '알람 업데이트에 실패했습니다.' });
          throw error;
        }
      },

      deleteAlarm: (id) => {
        try {
          set((state) => ({
            alarms: state.alarms.filter(alarm => alarm.id !== id)
          }));
        } catch (error) {
          set({ error: '알람 삭제에 실패했습니다.' });
          throw error;
        }
      },

      setCurrentAudio: (audio) => set({ currentAudio: audio }),
      setVolume: (volume) => set({ volume }),
      setMuted: (isMuted) => set({ isMuted }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      triggerAlarm: (alarm) => {
        const now = new Date();
        const todayKey = now.toDateString();
        
        set((state) => ({
          ringingAlarm: alarm,
          isRinging: true,
          alarms: state.alarms.map(a => 
            a.id === alarm.id 
              ? { ...a, last_triggered: todayKey }
              : a
          )
        }));
      },

      stopAlarm: () => {
        set({ 
          ringingAlarm: null,
          isRinging: false
        });
      },

      getActiveAlarms: () => {
        const { alarms } = get();
        return alarms.filter(alarm => alarm.is_active);
      },

      checkAlarms: () => {
        const state = get();
        const { alarms, isRinging } = state;
        
        if (isRinging) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        const todayKey = now.toDateString();
        
        const triggeredAlarm = alarms.find(alarm => {
          if (!alarm.is_active) return false;
          
          const timeParts = alarm.alarm_time.split(':');
          const alarmHour = parseInt(timeParts[0]);
          const alarmMinute = parseInt(timeParts[1]);
          const alarmSecond = timeParts[2] ? parseInt(timeParts[2]) : 0;
          
          const timeMatches = currentHour === alarmHour && 
                             currentMinute === alarmMinute && 
                             currentSecond >= alarmSecond && 
                             currentSecond < alarmSecond + 60;
          
          return timeMatches && alarm.last_triggered !== todayKey;
        });
        
        if (triggeredAlarm) {
          get().triggerAlarm(triggeredAlarm);
        }
      }
    }),
    {
      name: 'alarm-storage',
      partialize: (state) => ({ 
        alarms: state.alarms,
        volume: state.volume,
        isMuted: state.isMuted 
      }),
    }
  )
);