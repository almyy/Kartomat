import { Student } from '../types/student'
import { SeatState } from '../store/classroomSlice'

interface LegacyState {
  students?: string[] | Student[]
  layout?: boolean[][]
  seatGenders?: ('male' | 'female' | 'any')[][]
  seatState?: SeatState[][]
  [key: string]: unknown
}

/**
 * Migrates localStorage from old format to new format
 * 1. Detects if students is a string array and converts to Student objects
 * 2. Detects if layout+seatGenders exist and converts to seatState
 */
export function migrateLocalStorage(): void {
  const storageKey = 'kartomat-storage'
  
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return
    
    const parsed = JSON.parse(stored)
    const state = parsed.state as LegacyState
    
    if (!state) return
    
    let needsSave = false
    
    // Migration 1: Convert students from string[] to Student[]
    if (state.students && Array.isArray(state.students) && state.students.length > 0) {
      const firstStudent = state.students[0]
      
      // If first item is a string, migrate entire array
      if (typeof firstStudent === 'string') {
        console.log('[Migration] Converting students from string[] to Student[]')
        state.students = (state.students as string[]).map(name => ({
          name,
          gender: undefined
        }))
        needsSave = true
      }
    }
    
    // Migration 2: Convert layout+seatGenders to seatState
    if (state.layout && state.seatGenders && !state.seatState) {
      console.log('[Migration] Converting layout+seatGenders to seatState')
      const rows = state.layout.length
      const cols = state.layout[0]?.length || 0
      
      const seatState: SeatState[][] = []
      
      for (let r = 0; r < rows; r++) {
        const row: SeatState[] = []
        for (let c = 0; c < cols; c++) {
          const isAvailable = state.layout[r]?.[c] ?? true
          const gender = state.seatGenders[r]?.[c] ?? 'any'
          
          if (!isAvailable) {
            row.push('off')
          } else if (gender === 'male') {
            row.push('m')
          } else if (gender === 'female') {
            row.push('f')
          } else {
            row.push('n')
          }
        }
        seatState.push(row)
      }
      
      state.seatState = seatState
      // Remove old properties
      delete state.layout
      delete state.seatGenders
      needsSave = true
    }
    
    // Save migrated state back to localStorage if any migration occurred
    if (needsSave) {
      parsed.state = state
      localStorage.setItem(storageKey, JSON.stringify(parsed))
      console.log('[Migration] Successfully migrated localStorage data')
    }
  } catch (error) {
    console.error('[Migration] Error migrating localStorage:', error)
    // Don't throw - let the app continue even if migration fails
  }
}
