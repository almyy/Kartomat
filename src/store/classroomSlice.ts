import { StateCreator } from 'zustand'

export type SeatState = 'off' | 'n' | 'm' | 'f' // off, neutral (any gender), male, female
const cycle: SeatState[] = ['n', 'm', 'f', 'off']

export interface ClassroomSlice {
  rows: number
  cols: number
  seatState: SeatState[][] // Combined availability and gender restriction
  setRows: (rows: number) => void
  setCols: (cols: number) => void
  setSeatState: (seatState: SeatState[][]) => void
  cycleSeat: (row: number, col: number) => void
}

// Helper to create default seat state (all neutral/available)
function createDefaultSeatState(rows: number, cols: number): SeatState[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill('n'))
}

export const createClassroomSlice: StateCreator<
  ClassroomSlice,
  [],
  [],
  ClassroomSlice
> = (set, get) => ({
  rows: 4,
  cols: 6,
  seatState: createDefaultSeatState(4, 6),
  
  setRows: (rows) => {
    const { cols } = get()
    set({ 
      rows, 
      seatState: createDefaultSeatState(rows, cols)
    })
  },
  setCols: (cols) => {
    const { rows } = get()
    set({ 
      cols, 
      seatState: createDefaultSeatState(rows, cols)
    })
  },
  setSeatState: (seatState) => set({ seatState }),
  cycleSeat: (row, col) => 
    set((state) => {
      const newSeatState = state.seatState.map(r => [...r])
      const current = state.seatState[row][col]
      const currentIndex = cycle.indexOf(current)
      // Handle -1 (not found) by treating as last index so it cycles to 0
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % cycle.length
      newSeatState[row][col] = cycle[nextIndex]
      
      return { seatState: newSeatState }
    }),
})
