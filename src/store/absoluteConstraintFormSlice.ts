import { StateCreator } from 'zustand'

export interface AbsoluteConstraintFormSlice {
  absoluteStudent: string
  absoluteRow: number
  absoluteCol: number
  setAbsoluteStudent: (student: string) => void
  setAbsoluteRow: (row: number) => void
  setAbsoluteCol: (col: number) => void
  resetAbsoluteForm: () => void
}

const initialState = {
  absoluteStudent: '',
  absoluteRow: 0,
  absoluteCol: 0
}

export const createAbsoluteConstraintFormSlice: StateCreator<AbsoluteConstraintFormSlice> = (set) => ({
  ...initialState,
  setAbsoluteStudent: (student) => set({ absoluteStudent: student }),
  setAbsoluteRow: (row) => set({ absoluteRow: row }),
  setAbsoluteCol: (col) => set({ absoluteCol: col }),
  resetAbsoluteForm: () => set(initialState)
})
