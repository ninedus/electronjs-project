import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStopwatchStore = create(
  persist(
    (set, get) => ({
      currentTime: 0,
      isRunning: false,
      records: [],
      intervalId: null,
      startTime: 0,

      start: () => {
        const state = get();
        if (state.isRunning) return;

        if (state.intervalId) clearInterval(state.intervalId);

        const newStartTime = Date.now() - state.currentTime;

        const intervalId = setInterval(() => {
          // set((state) => ({ currentTime: state.currentTime + 1 }));
          set({ currentTime: Date.now() - get().startTime });
        }, 10);

        set({ isRunning: true, intervalId, startTime: newStartTime });
      },

      stop: () => {
        const state = get();
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        set({ isRunning: false, intervalId: null });
      },

      reset: () => {
        const state = get();
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        set({
          currentTime: 0,
          isRunning: false,
          records: [],
          intervalId: null,
          startTime: 0,
        });
      },

      addRecord: () => {
        const state = get();
        set({ records: [...state.records, state.currentTime] });
      },
    }),
    {
      name: "stopwatch-storage",
      partialize: (state) => ({ records: state.records, currentTime: state.currentTime }),
    }
  )
);
