import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CollegeBasic } from "@/types";

interface CompareStore {
  selectedColleges: CollegeBasic[];
  addCollege: (college: CollegeBasic) => boolean;
  removeCollege: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedColleges: [],
      addCollege: (college) => {
        const current = get().selectedColleges;
        if (current.some((c) => c.id === college.id)) {
          return true;
        }
        if (current.length >= 3) {
          return false;
        }
        set({ selectedColleges: [...current, college] });
        return true;
      },
      removeCollege: (id) => {
        set({
          selectedColleges: get().selectedColleges.filter((c) => c.id !== id),
        });
      },
      clearCompare: () => set({ selectedColleges: [] }),
      isComparing: (id) => get().selectedColleges.some((c) => c.id === id),
    }),
    {
      name: "campusiq-compare-tray",
    }
  )
);
