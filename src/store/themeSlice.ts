import { StateCreator } from 'zustand'

export type Theme = 'light' | 'dark'

export interface ThemeSlice {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: 'dark', // Default theme is dark (current behavior)
  setTheme: (theme) => {
    set({ theme })
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      // Apply theme to document root
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { theme: newTheme }
    })
  },
})
