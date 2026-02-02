import { StateCreator } from "zustand";
import { SeatingResult } from "../cspSolver";

export interface SolverSlice {
  seatingResult: SeatingResult | null;
  setSeatingResult: (result: SeatingResult | null) => void;
}

export const createSolverSlice: StateCreator<
  SolverSlice,
  [],
  [],
  SolverSlice
> = (set) => ({
  seatingResult: null,

  setSeatingResult: (result) => set({ seatingResult: result }),
});
