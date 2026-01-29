import { StateCreator } from 'zustand'

export interface ClassroomSlice {
  rows: number
  cols: number
  layout: boolean[][] // true = available seat, false = empty space
  setRows: (rows: number) => void
  setCols: (cols: number) => void
  setLayout: (layout: boolean[][]) => void
  toggleSeat: (row: number, col: number) => void
}

// Helper to create default layout (all seats available)
function createDefaultLayout(rows: number, cols: number): boolean[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(true))
}

export const createClassroomSlice: StateCreator<
  ClassroomSlice,
  [],
  [],
  ClassroomSlice
> = (set, get) => ({
  rows: 4,
  cols: 6,
  layout: createDefaultLayout(4, 6),
  
  setRows: (rows) => {
    const { cols } = get()
    set({ rows, layout: createDefaultLayout(rows, cols) })
  },
  setCols: (cols) => {
    const { rows } = get()
    set({ cols, layout: createDefaultLayout(rows, cols) })
  },
  setLayout: (layout) => set({ layout }),
  toggleSeat: (row, col) => {
    const { layout } = get()
    const newLayout = layout.map((r, rIdx) => 
      r.map((seat, cIdx) => (rIdx === row && cIdx === col) ? !seat : seat)
    )
    set({ layout: newLayout })
  },
})
