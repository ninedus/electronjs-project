import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTimerStore = create(
  persist(
    (set, get) => ({
      currentTime: 0,
      duration: 0,
      isRunning: false,
      isPaused: false,
      isCompleted: false,

      sound: "music1",
      volume: 0.5,
      isMuted: false,

      intervalId: null,

      setTimer: (settings) => {
        const { duration, sound, volume, isMuted } = settings;
        set({
          duration,
          currentTime: duration,
          sound,
          volume,
          isMuted,
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        });
      },

      startTimer: () => {
        const state = get();

        if (state.isRunning || state.currentTime <= 0) return;

        if (state.intervalId) {
          clearInterval(state.intervalId);
        }

        const intervalId = setInterval(() => {
          const currentState = get();

          if (currentState.currentTime <= 1) {
            clearInterval(currentState.intervalId);
            set({
              currentTime: 0,
              isRunning: false,
              isPaused: false,
              isCompleted: true,
              intervalId: null,
            });

          } else {
            set({ currentTime: currentState.currentTime - 1 });
          }
        }, 1000);

        set({
          isRunning: true,
          isPaused: false,
          intervalId,
        });
      },

      pauseTimer: () => {
        const state = get();

        if (state.intervalId) {
          clearInterval(state.intervalId);
        }

        set({
          isRunning: false,
          isPaused: true,
          intervalId: null,
        });
      },

      stopTimer: () => {
        const state = get();

        if (state.intervalId) {
          clearInterval(state.intervalId);
        }

        set({
          currentTime: state.duration,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
          intervalId: null,
        });
      },

      resetTimer: () => {
        const state = get();

        if (state.intervalId) {
          clearInterval(state.intervalId);
        }

        set({
          currentTime: 0,
          duration: 0,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
          intervalId: null,
        });
      },

      updateAlarmSettings: (settings) => {
        set({
          sound: settings.sound || get().sound,
          volume:
            settings.volume !== undefined ? settings.volume : get().volume,
          isMuted:
            settings.isMuted !== undefined ? settings.isMuted : get().isMuted,
        });
      },

      resetCompleted: () => {
        set({ isCompleted: false });
      },
    }),
    {
      name: "timer-storage",
      partialize: (state) => ({
        duration: state.duration,
        sound: state.sound,
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    }
  )
);
