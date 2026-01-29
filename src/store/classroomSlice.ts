import { StateCreator } from 'zustand'

export interface ClassroomSlice {
  rows: number
  cols: number
  setRows: (rows: number) => void
  setCols: (cols: number) => void
}

export const createClassroomSlice: StateCreator<
  ClassroomSlice,
  [],
  [],
  ClassroomSlice
> = (set) => ({
  rows: 4,
  cols: 6,
  
  setRows: (rows) => set({ rows }),
  setCols: (cols) => set({ cols }),
})
