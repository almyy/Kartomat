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
    
    const newLayout = [...layout]
    const newSeatGenders = seatGenders.map(r => [...r])
    
    const currentGender = seatGenders[row][col]
    const isAvailable = layout[row][col]
    
    // Cycle: any → male → female → off → any
    if (isAvailable) {
      if (currentGender === 'any') {
        newSeatGenders[row][col] = 'male'
      } else if (currentGender === 'male') {
        newSeatGenders[row][col] = 'female'
      } else if (currentGender === 'female') {
        // Turn off the seat
        newLayout[row] = [...newLayout[row]]
        newLayout[row][col] = false
        newSeatGenders[row][col] = 'any' // Reset to 'any' for when it's turned back on
      }
    } else {
      // Turn seat back on with 'any' gender
      newLayout[row] = [...newLayout[row]]
      newLayout[row][col] = true
      newSeatGenders[row][col] = 'any'
    }
    
    set({ layout: newLayout, seatGenders: newSeatGenders })
  },
})
