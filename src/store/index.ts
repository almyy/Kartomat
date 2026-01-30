import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStudentsSlice, StudentsSlice } from './studentsSlice'
import { createClassroomSlice, ClassroomSlice } from './classroomSlice'
import { createConstraintsSlice, ConstraintsSlice } from './constraintsSlice'
import { createSolverSlice, SolverSlice } from './solverSlice'
import { createConstraintTypeSlice, ConstraintTypeSlice } from './constraintTypeSlice'
import { createPairConstraintFormSlice, PairConstraintFormSlice } from './pairConstraintFormSlice'
import { createRowConstraintFormSlice, RowConstraintFormSlice } from './rowConstraintFormSlice'
import { createFarApartConstraintFormSlice, FarApartConstraintFormSlice } from './farApartConstraintFormSlice'
import { createAbsoluteConstraintFormSlice, AbsoluteConstraintFormSlice } from './absoluteConstraintFormSlice'

// Combined store type
export type AppStore = StudentsSlice & 
  ClassroomSlice & 
  ConstraintsSlice & 
  SolverSlice & 
  ConstraintTypeSlice & 
  PairConstraintFormSlice & 
  RowConstraintFormSlice & 
  FarApartConstraintFormSlice & 
  AbsoluteConstraintFormSlice

export const useStore = create<AppStore>()(
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
    }),
    {
      name: 'kartomat-storage', // localStorage key
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
