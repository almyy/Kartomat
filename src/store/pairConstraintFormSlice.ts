import { StateCreator } from "zustand";

export interface PairConstraintFormSlice {
  pairStudent1: string;
  pairStudent2: string;
  setPairStudent1: (student: string) => void;
  setPairStudent2: (student: string) => void;
  resetPairForm: () => void;
}

const initialState = {
  pairStudent1: "",
  pairStudent2: "",
};

export const createPairConstraintFormSlice: StateCreator<
  PairConstraintFormSlice
> = (set) => ({
  ...initialState,
  setPairStudent1: (student) => set({ pairStudent1: student }),
  setPairStudent2: (student) => set({ pairStudent2: student }),
  resetPairForm: () => set(initialState),
});
