import { StateCreator } from "zustand";

export interface FarApartConstraintFormSlice {
  farApartStudent1: string;
  farApartStudent2: string;
  farApartMinDistance: number;
  setFarApartStudent1: (student: string) => void;
  setFarApartStudent2: (student: string) => void;
  setFarApartMinDistance: (distance: number) => void;
  resetFarApartForm: () => void;
}

const initialState = {
  farApartStudent1: "",
  farApartStudent2: "",
  farApartMinDistance: 3,
};

export const createFarApartConstraintFormSlice: StateCreator<
  FarApartConstraintFormSlice
> = (set) => ({
  ...initialState,
  setFarApartStudent1: (student) => set({ farApartStudent1: student }),
  setFarApartStudent2: (student) => set({ farApartStudent2: student }),
  setFarApartMinDistance: (distance) => set({ farApartMinDistance: distance }),
  resetFarApartForm: () => set(initialState),
});
