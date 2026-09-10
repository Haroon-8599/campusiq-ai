import { create } from "zustand";
import { SearchFilterState } from "@/types";

interface FilterStore extends SearchFilterState {
  setQuery: (query: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setCourse: (course: string) => void;
  setCollegeType: (type: string) => void;
  setOwnership: (ownership: string) => void;
  setMinRating: (rating: number) => void;
  setMaxFees: (fees: number) => void;
  setMinAvgPackage: (pkg: number) => void;
  setExam: (exam: string) => void;
  setNirfTier: (tier: string) => void;
  setHostelOnly: (hostel: boolean) => void;
  setSortBy: (sort: SearchFilterState["sortBy"]) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialState: SearchFilterState = {
  query: "",
  state: "",
  city: "",
  course: "",
  collegeType: "",
  ownership: "",
  minRating: 0,
  maxFees: 1000000,
  minAvgPackage: 0,
  exam: "",
  nirfTier: "",
  hostelOnly: false,
  sortBy: "match",
  page: 1,
  limit: 12,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query, page: 1 }),
  setState: (state) => set({ state, city: "", page: 1 }),
  setCity: (city) => set({ city, page: 1 }),
  setCourse: (course) => set({ course, page: 1 }),
  setCollegeType: (collegeType) => set({ collegeType, page: 1 }),
  setOwnership: (ownership) => set({ ownership, page: 1 }),
  setMinRating: (minRating) => set({ minRating, page: 1 }),
  setMaxFees: (maxFees) => set({ maxFees, page: 1 }),
  setMinAvgPackage: (minAvgPackage) => set({ minAvgPackage, page: 1 }),
  setExam: (exam) => set({ exam, page: 1 }),
  setNirfTier: (nirfTier) => set({ nirfTier, page: 1 }),
  setHostelOnly: (hostelOnly) => set({ hostelOnly, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initialState }),
}));
