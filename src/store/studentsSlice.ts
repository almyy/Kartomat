import { StateCreator } from 'zustand'
import { ConstraintsSlice } from './constraintsSlice'

export interface StudentsSlice {
  students: string[]
  addStudent: (name: string) => void
  removeStudent: (name: string) => void
}

export const createStudentsSlice: StateCreator<
  StudentsSlice & ConstraintsSlice,
  [],
  [],
  StudentsSlice
> = (set) => ({
  students: [],
  
  addStudent: (name) => 
    set((state) => {
      const trimmed = name.trim()
      if (trimmed && !state.students.includes(trimmed)) {
        return { students: [...state.students, trimmed] }
      }
      return state
    }),
  
  removeStudent: (name) =>
    set((state) => ({
      students: state.students.filter(s => s !== name),
      // Also remove constraints involving this student
      constraints: state.constraints.filter(c => 
        c.student1 !== name && !('student2' in c && c.student2 === name)
      )
    })),
})
