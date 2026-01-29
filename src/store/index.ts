import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStudentsSlice, StudentsSlice } from './studentsSlice'
import { createClassroomSlice, ClassroomSlice } from './classroomSlice'
import { createConstraintsSlice, ConstraintsSlice } from './constraintsSlice'
import { createSolverSlice, SolverSlice } from './solverSlice'

// Combined store type
export type AppStore = StudentsSlice & ClassroomSlice & ConstraintsSlice & SolverSlice

export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createStudentsSlice(...a),
      ...createClassroomSlice(...a),
      ...createConstraintsSlice(...a),
      ...createSolverSlice(...a),
    }),
    {
      name: 'roomy-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        students: state.students,
        rows: state.rows,
        cols: state.cols,
        layout: state.layout,
        constraints: state.constraints,
      }),
    }
  )
)
