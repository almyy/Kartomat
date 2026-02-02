import { StateCreator } from "zustand";

export interface RowConstraintFormSlice {
  rowStudent: string;
  rowNumber: number;
  setRowStudent: (student: string) => void;
  setRowNumber: (row: number) => void;
  resetRowForm: () => void;
}

const initialState = {
  rowStudent: "",
  rowNumber: 0,
};

export const createRowConstraintFormSlice: StateCreator<
  RowConstraintFormSlice
> = (set) => ({
  ...initialState,
  setRowStudent: (student) => set({ rowStudent: student }),
  setRowNumber: (row) => set({ rowNumber: row }),
  resetRowForm: () => set(initialState),
});
