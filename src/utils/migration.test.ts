import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { migrateLocalStorage } from './migration'

describe('localStorage Migration', () => {
  const storageKey = 'kartomat-storage'
  let mockStorage: Record<string, string> = {}
  
  beforeEach(() => {
    mockStorage = {}
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key]
      }),
      clear: vi.fn(() => {
        mockStorage = {}
      }),
      length: 0,
      key: vi.fn(() => null)
    } as Storage
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should migrate old string array format to Student objects', () => {
    // Setup old format
    const oldFormat = {
      state: {
        students: ['Alice', 'Bob', 'Charlie'],
        rows: 5,
        cols: 6
      },
      version: 0
    }
    mockStorage[storageKey] = JSON.stringify(oldFormat)
    
    // Run migration
    migrateLocalStorage()
    
    // Verify migration
    const stored = mockStorage[storageKey]
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.state.students).toEqual([
      { name: 'Alice', gender: undefined },
      { name: 'Bob', gender: undefined },
      { name: 'Charlie', gender: undefined }
    ])
    
    // Other data should be unchanged
    expect(parsed.state.rows).toBe(5)
    expect(parsed.state.cols).toBe(6)
  })

  it('should not modify already migrated data', () => {
    // Setup new format
    const newFormat = {
      state: {
        students: [
          { name: 'Alice', gender: 'female' },
          { name: 'Bob', gender: 'male' }
        ],
        rows: 5,
        cols: 6
      },
      version: 0
    }
    mockStorage[storageKey] = JSON.stringify(newFormat)
    
    // Run migration
    migrateLocalStorage()
    
    // Verify data is unchanged
    const stored = mockStorage[storageKey]
    const parsed = JSON.parse(stored!)
    expect(parsed.state.students).toEqual([
      { name: 'Alice', gender: 'female' },
      { name: 'Bob', gender: 'male' }
    ])
  })

  it('should handle empty students array', () => {
    const emptyFormat = {
      state: {
        students: [],
        rows: 5,
        cols: 6
      },
      version: 0
    }
    mockStorage[storageKey] = JSON.stringify(emptyFormat)
    
    // Run migration (should not throw)
    expect(() => migrateLocalStorage()).not.toThrow()
  })

  it('should handle missing localStorage', () => {
    // No localStorage data
    expect(() => migrateLocalStorage()).not.toThrow()
  })

  it('should handle corrupted localStorage', () => {
    mockStorage[storageKey] = 'invalid json{'
    
    // Should not throw, just log error
    expect(() => migrateLocalStorage()).not.toThrow()
  })
})
