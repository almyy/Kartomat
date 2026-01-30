import { StateCreator } from 'zustand'
import { ConstraintsSlice } from './constraintsSlice'
import { Student, Gender } from '../types/student'

export interface StudentsSlice {
  students: Student[]
  addStudent: (name: string) => void
  removeStudent: (name: string) => void
  updateStudentGender: (name: string, gender?: Gender) => void
  cycleStudentGender: (name: string) => void
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
      if (trimmed && !state.students.some(s => s.name === trimmed)) {
        return { students: [...state.students, { name: trimmed }] }
      }
      return state
    }),
  
  removeStudent: (name) =>
    set((state) => ({
      students: state.students.filter(s => s.name !== name),
      // Also remove constraints involving this student
      constraints: state.constraints.filter(c => 
        c.student1 !== name && !('student2' in c && c.student2 === name)
      )
    })),
  
  updateStudentGender: (name, gender) =>
    set((state) => ({
      students: state.students.map(s => 
        s.name === name ? { ...s, gender } : s
      )
    })),
  
  cycleStudentGender: (name) =>
    set((state) => {
      const cycle: (Gender | undefined)[] = [undefined, 'male', 'female']
      
      const newStudents = state.students.map(s => {
        if (s.name !== name) return s
        
        const currentIndex = cycle.indexOf(s.gender)
        const nextIndex = (currentIndex + 1) % cycle.length
        
        return { ...s, gender: cycle[nextIndex] }
      })
      
      return { students: newStudents }
    }),
})
