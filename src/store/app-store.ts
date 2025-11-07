import { create } from 'zustand';

interface AppState {
  isScheduleModalOpen: boolean;
  patientsToSchedule: any[];
  setScheduleModalOpen: (isOpen: boolean) => void;
  setPatientsToSchedule: (patients: any[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isScheduleModalOpen: false,
  patientsToSchedule: [],
  setScheduleModalOpen: (isOpen) => set({ isScheduleModalOpen: isOpen }),
  setPatientsToSchedule: (patients) => set({ patientsToSchedule: patients }),
}));