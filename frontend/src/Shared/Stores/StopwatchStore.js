import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStopwatchStore = create(
  persist(
    (set, get) => ({
      currentTime: 0,
      isRunning: false,
      records: [],
      intervalId: null,

      start: () => {
        const state = get();
        if (state.isRunning) return;

        if (state.intervalId) clearInterval(state.intervalId);

        const intervalId = setInterval(() => {
          set((state) => ({ currentTime: state.currentTime + 1 }));
        }, 1);

        set({ isRunning: true, intervalId });
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
        });
      },

      addRecord: () => {
        const state = get();
        set({ records: [...state.records, state.currentTime] });
      },
    }),
    {
      name: "stopwatch-storage",
      partialize: (state) => ({ records: state.records }),
    }
  )
);
