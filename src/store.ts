import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Constraint, ConstraintType, SeatingResult, CONSTRAINT_TYPES, RowConstraint, PairConstraint } from './cspSolver'

interface AppState {
  // Student state
  students: string[]
  studentInput: string
  
  // Classroom state
  rows: number
  cols: number
  
  // Constraint state
  constraints: Constraint[]
  constraintType: ConstraintType
  student1: string
  student2: string
  rowConstraint: number
  
  // Seating result state
  seatingResult: SeatingResult | null
  
  // Student actions
  setStudentInput: (input: string) => void
  addStudent: () => void
  removeStudent: (name: string) => void
  
  // Classroom actions
  setRows: (rows: number) => void
  setCols: (cols: number) => void
  
  // Constraint actions
  setConstraintType: (type: ConstraintType) => void
  setStudent1: (student: string) => void
  setStudent2: (student: string) => void
  setRowConstraint: (row: number) => void
  addConstraint: () => void
  removeConstraint: (index: number) => void
  
  // Solver actions
  setSeatingResult: (result: SeatingResult | null) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      students: [],
      studentInput: '',
      rows: 4,
      cols: 6,
      constraints: [],
      constraintType: CONSTRAINT_TYPES.NOT_TOGETHER,
      student1: '',
      student2: '',
      rowConstraint: 0,
      seatingResult: null,
      
      // Student actions
      setStudentInput: (input) => set({ studentInput: input }),
      
      addStudent: () => {
        const { studentInput, students } = get()
        const trimmed = studentInput.trim()
        if (trimmed && !students.includes(trimmed)) {
          set({ 
            students: [...students, trimmed],
            studentInput: ''
          })
        }
      },
      
      removeStudent: (name) => {
        const { students, constraints } = get()
        set({
          students: students.filter(s => s !== name),
          // Also remove constraints involving this student
          constraints: constraints.filter(c => 
            c.student1 !== name && !('student2' in c && c.student2 === name)
          )
        })
      },
      
      // Classroom actions
      setRows: (rows) => set({ rows }),
      setCols: (cols) => set({ cols }),
      
      // Constraint actions
      setConstraintType: (type) => set({ constraintType: type }),
      setStudent1: (student) => set({ student1: student }),
      setStudent2: (student) => set({ student2: student }),
      setRowConstraint: (row) => set({ rowConstraint: row }),
      
      addConstraint: () => {
        const { constraintType, student1, student2, rowConstraint, students, constraints } = get()
        
        if (constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW) {
          if (student1 && students.includes(student1)) {
            const newConstraint: RowConstraint = {
              type: constraintType,
              student1,
              row: parseInt(String(rowConstraint))
            }
            set({
              constraints: [...constraints, newConstraint],
              student1: ''
            })
          }
        } else {
          if (student1 && student2 && student1 !== student2 && 
              students.includes(student1) && students.includes(student2)) {
            const newConstraint: PairConstraint = {
              type: constraintType as typeof CONSTRAINT_TYPES.NOT_TOGETHER | typeof CONSTRAINT_TYPES.TOGETHER,
              student1,
              student2
            }
            set({
              constraints: [...constraints, newConstraint],
              student1: '',
              student2: ''
            })
          }
        }
      },
      
      removeConstraint: (index) => {
        const { constraints } = get()
        set({
          constraints: constraints.filter((_, i) => i !== index)
        })
      },
      
      // Solver actions
      setSeatingResult: (result) => set({ seatingResult: result }),
    }),
    {
      name: 'roomy-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        students: state.students,
        rows: state.rows,
        cols: state.cols,
        constraints: state.constraints,
      }),
    }
  )
)
