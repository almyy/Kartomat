import { Student } from '../types/student'

interface LegacyState {
  students?: string[] | Student[]
  [key: string]: unknown
}

/**
 * Migrates localStorage from old format to new format
 * Detects if students is a string array and converts to Student objects
 */
export function migrateLocalStorage(): void {
  const storageKey = 'kartomat-storage'
  
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return
    
    const parsed = JSON.parse(stored)
    const state = parsed.state as LegacyState
    
    if (!state || !state.students) return
    
    // Check if students is an array of strings (old format)
    if (Array.isArray(state.students) && state.students.length > 0) {
      const firstStudent = state.students[0]
      
      // If first item is a string, migrate entire array
      if (typeof firstStudent === 'string') {
        console.log('[Migration] Converting students from string[] to Student[]')
        state.students = (state.students as string[]).map(name => ({
          name,
          gender: undefined
        }))
        
        // Save migrated state back to localStorage
        parsed.state = state
        localStorage.setItem(storageKey, JSON.stringify(parsed))
        console.log('[Migration] Successfully migrated students data')
      }
    }
  } catch (error) {
    console.error('[Migration] Error migrating localStorage:', error)
    // Don't throw - let the app continue even if migration fails
  }
}
