import { StateCreator } from 'zustand'
import { Gender } from '../types/student'

export type SeatGenderRestriction = Gender | 'any'

export interface ClassroomSlice {
  rows: number
  cols: number
  layout: boolean[][] // true = available seat, false = empty space
  seatGenders: SeatGenderRestriction[][] // Gender restriction per seat
  setRows: (rows: number) => void
  setCols: (cols: number) => void
  setLayout: (layout: boolean[][]) => void
  setSeatGenders: (seatGenders: SeatGenderRestriction[][]) => void
  toggleSeat: (row: number, col: number) => void
  cycleSeatGender: (row: number, col: number) => void
}

// Helper to create default layout (all seats available)
function createDefaultLayout(rows: number, cols: number): boolean[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(true))
}

// Helper to create default gender restrictions (all seats 'any')
function createDefaultSeatGenders(rows: number, cols: number): SeatGenderRestriction[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill('any'))
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
  seatGenders: createDefaultSeatGenders(4, 6),
  
  setRows: (rows) => {
    const { cols } = get()
    set({ 
      rows, 
      layout: createDefaultLayout(rows, cols),
      seatGenders: createDefaultSeatGenders(rows, cols)
    })
  },
  setCols: (cols) => {
    const { rows } = get()
    set({ 
      cols, 
      layout: createDefaultLayout(rows, cols),
      seatGenders: createDefaultSeatGenders(rows, cols)
    })
  },
  setLayout: (layout) => set({ layout }),
  setSeatGenders: (seatGenders) => set({ seatGenders }),
  toggleSeat: (row, col) => {
    const { layout } = get()
    const newLayout = layout.map((r, rIdx) => 
      r.map((seat, cIdx) => (rIdx === row && cIdx === col) ? !seat : seat)
    )
    set({ layout: newLayout })
  },
  cycleSeatGender: (row, col) => {
    const { seatGenders, layout } = get()
    // Only cycle if seat is available
    if (!layout[row][col]) return
    
    const newSeatGenders = seatGenders.map((r, rIdx) => 
      r.map((gender, cIdx) => {
        if (rIdx === row && cIdx === col) {
          // Cycle: any → male → female → any
          if (gender === 'any') return 'male'
          if (gender === 'male') return 'female'
          return 'any'
        }
        return gender
      })
    )
    set({ seatGenders: newSeatGenders })
  },
})
