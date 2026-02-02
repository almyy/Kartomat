import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { temporal } from 'zundo'
import { createStudentsSlice, StudentsSlice } from './studentsSlice'
import { createClassroomSlice, ClassroomSlice } from './classroomSlice'
import { createConstraintsSlice, ConstraintsSlice } from './constraintsSlice'
import { createSolverSlice, SolverSlice } from './solverSlice'
import { createConstraintTypeSlice, ConstraintTypeSlice } from './constraintTypeSlice'
import { createPairConstraintFormSlice, PairConstraintFormSlice } from './pairConstraintFormSlice'
import { createRowConstraintFormSlice, RowConstraintFormSlice } from './rowConstraintFormSlice'
import { createFarApartConstraintFormSlice, FarApartConstraintFormSlice } from './farApartConstraintFormSlice'
import { createAbsoluteConstraintFormSlice, AbsoluteConstraintFormSlice } from './absoluteConstraintFormSlice'
import { createThemeSlice, ThemeSlice } from './themeSlice'

// Combined store type
export type AppStore = StudentsSlice & 
  ClassroomSlice & 
  ConstraintsSlice & 
  SolverSlice & 
  ConstraintTypeSlice & 
  PairConstraintFormSlice & 
  RowConstraintFormSlice & 
  FarApartConstraintFormSlice & 
  AbsoluteConstraintFormSlice &
  ThemeSlice

export const useStore = create<AppStore>()(
  temporal(
    persist(
      (...a) => ({
        ...createStudentsSlice(...a),
        ...createClassroomSlice(...a),
        ...createConstraintsSlice(...a),
        ...createSolverSlice(...a),
        ...createConstraintTypeSlice(...a),
        ...createPairConstraintFormSlice(...a),
        ...createRowConstraintFormSlice(...a),
        ...createFarApartConstraintFormSlice(...a),
        ...createAbsoluteConstraintFormSlice(...a),
        ...createThemeSlice(...a),
      }),
      {
        name: 'kartomat-storage', // localStorage key
        partialize: (state) => ({
          // Only persist these fields
          students: state.students,
          rows: state.rows,
          cols: state.cols,
          seatState: state.seatState,
          constraints: state.constraints,
          seatingResult: state.seatingResult,
          theme: state.theme,
        }),
      }
    ),
    {
      // Track these fields for undo/redo
      partialize: (state) => ({
        students: state.students,
        rows: state.rows,
        cols: state.cols,
        seatState: state.seatState,
        constraints: state.constraints,
        seatingResult: state.seatingResult,
      }),
      limit: 50, // Keep last 50 states
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b), // Skip saving duplicate states
    }
  )
)
