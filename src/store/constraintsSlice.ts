import { StateCreator } from "zustand";
import { Constraint } from "../cspSolver";

export interface ConstraintsSlice {
  constraints: Constraint[];
  addConstraint: (constraint: Constraint) => void;
  removeConstraint: (index: number) => void;
}

export const createConstraintsSlice: StateCreator<
  ConstraintsSlice,
  [],
  [],
  ConstraintsSlice
> = (set) => ({
  constraints: [],

  addConstraint: (constraint) =>
    set((state) => ({
      constraints: [...state.constraints, constraint],
    })),

  removeConstraint: (index) =>
    set((state) => ({
      constraints: state.constraints.filter((_, i) => i !== index),
    })),
});
