import { StateCreator } from "zustand";
import { CONSTRAINT_TYPES } from "../cspSolver";

export interface ConstraintTypeSlice {
  constraintType: (typeof CONSTRAINT_TYPES)[keyof typeof CONSTRAINT_TYPES];
  setConstraintType: (
    type: (typeof CONSTRAINT_TYPES)[keyof typeof CONSTRAINT_TYPES],
  ) => void;
}

export const createConstraintTypeSlice: StateCreator<ConstraintTypeSlice> = (
  set,
) => ({
  constraintType: CONSTRAINT_TYPES.NOT_TOGETHER,
  setConstraintType: (type) => set({ constraintType: type }),
});
