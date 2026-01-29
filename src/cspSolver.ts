/**
 * Constraint Satisfaction Problem Solver for Classroom Seating
 */

// Constraint types
export const CONSTRAINT_TYPES = {
  NOT_TOGETHER: 'not_together',
  TOGETHER: 'together',
  MUST_BE_IN_ROW: 'must_be_in_row',
  FAR_APART: 'far_apart'
} as const;

export type ConstraintType = typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES];

export interface BaseConstraint {
  type: ConstraintType;
  student1: string;
}

export interface PairConstraint extends BaseConstraint {
  type: typeof CONSTRAINT_TYPES.NOT_TOGETHER | typeof CONSTRAINT_TYPES.TOGETHER;
  student2: string;
}

export interface RowConstraint extends BaseConstraint {
  type: typeof CONSTRAINT_TYPES.MUST_BE_IN_ROW;
  row: number;
}

export interface FarApartConstraint extends BaseConstraint {
  type: typeof CONSTRAINT_TYPES.FAR_APART;
  student2: string;
  minDistance: number;
}

export type Constraint = PairConstraint | RowConstraint | FarApartConstraint;

export interface SeatingResult {
  success: boolean;
  seating?: (string | null)[][];
  message?: string;
}

type Seating = (string | null)[][];

/**
 * Solves the classroom seating CSP using backtracking with constraint propagation
 */
export function solveSeatingCSP(
  students: string[],
  constraints: Constraint[],
  rows: number,
  cols: number,
  layout?: boolean[][]
): SeatingResult {
  // Use default layout if not provided (all seats available)
  const seatLayout = layout || Array(rows).fill(null).map(() => Array(cols).fill(true));
  
  // Count available seats
  const availableSeats = seatLayout.flat().filter(seat => seat).length;
  
  if (students.length > availableSeats) {
    return { success: false, message: 'Not enough available seats for all students' };
  }
  
  // Initialize empty seating chart (row, col) -> student name
  const seating: Seating = Array(rows).fill(null).map(() => Array(cols).fill(null));
  const assignedStudents = new Set<string>();
  
  // Try to solve using backtracking
  const solution = backtrack(students, constraints, seating, assignedStudents, rows, cols, seatLayout);
  
  if (solution) {
    return { success: true, seating: solution };
  } else {
    return { success: false, message: 'No valid seating arrangement found. Try relaxing some constraints.' };
  }
}

/**
 * Backtracking algorithm to find valid seating arrangement
 */
function backtrack(
  students: string[],
  constraints: Constraint[],
  seating: Seating,
  assigned: Set<string>,
  rows: number,
  cols: number,
  layout: boolean[][]
): Seating | null {
  // Base case: all students assigned
  if (assigned.size === students.length) {
    return deepCopy(seating);
  }
  
  // Select next unassigned student
  const student = students.find(s => !assigned.has(s));
  
  if (!student) {
    return null;
  }
  
  // Try each available seat
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip unavailable seats (empty spaces)
      if (!layout[row][col]) {
        continue;
      }
      
      if (seating[row][col] === null) {
        // Try assigning student to this seat
        seating[row][col] = student;
        assigned.add(student);
        
        // Check if this assignment satisfies all constraints
        if (isConsistent(student, row, col, seating, constraints, rows, cols, layout)) {
          // Recurse
          const result = backtrack(students, constraints, seating, assigned, rows, cols, layout);
          if (result) {
            return result;
          }
        }
        
        // Backtrack
        seating[row][col] = null;
        assigned.delete(student);
      }
    }
  }
  
  return null;
}

/**
 * Check if current assignment is consistent with all constraints
 */
function isConsistent(
  student: string,
  row: number,
  col: number,
  seating: Seating,
  constraints: Constraint[],
  rows: number,
  cols: number,
  layout: boolean[][]
): boolean {
  // Check all constraints involving this student
  for (const constraint of constraints) {
    if (constraint.student1 === student || ('student2' in constraint && constraint.student2 === student)) {
      if (!checkConstraint(constraint, student, row, col, seating, rows, cols, layout)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a specific constraint is satisfied
 */
function checkConstraint(
  constraint: Constraint,
  student: string,
  row: number,
  col: number,
  seating: Seating,
  rows: number,
  cols: number,
  layout: boolean[][]
): boolean {
  const { type, student1 } = constraint;
  
  switch (type) {
    case CONSTRAINT_TYPES.MUST_BE_IN_ROW: {
      // Student must be in a specific row
      const rowConstraint = constraint as RowConstraint;
      if (student === student1) {
        return row === rowConstraint.row;
      }
      return true;
    }
      
    case CONSTRAINT_TYPES.NOT_TOGETHER: {
      // Two students should not be adjacent
      const pairConstraint = constraint as PairConstraint;
      const otherStudent = student === student1 ? pairConstraint.student2 : student1;
      const otherPos = findStudent(otherStudent, seating);
      
      if (otherPos) {
        const [otherRow, otherCol] = otherPos;
        return !areAdjacent(row, col, otherRow, otherCol);
      }
      return true; // Other student not assigned yet, constraint can't be violated
    }
      
    case CONSTRAINT_TYPES.TOGETHER: {
      // Two students should be adjacent
      const pairConstraint = constraint as PairConstraint;
      const partnerStudent = student === student1 ? pairConstraint.student2 : student1;
      const partnerPos = findStudent(partnerStudent, seating);
      
      if (partnerPos) {
        const [partnerRow, partnerCol] = partnerPos;
        return areAdjacent(row, col, partnerRow, partnerCol);
      }
      // If partner not assigned yet, we need to check if there's an adjacent empty seat
      return hasAdjacentEmptySeat(row, col, seating, rows, cols, layout);
    }
      
    case CONSTRAINT_TYPES.FAR_APART: {
      // Two students should be far apart (at least minDistance)
      const farApartConstraint = constraint as FarApartConstraint;
      const otherStudent = student === student1 ? farApartConstraint.student2 : student1;
      const otherPos = findStudent(otherStudent, seating);
      
      if (otherPos) {
        const [otherRow, otherCol] = otherPos;
        const distance = calculateDistance(row, col, otherRow, otherCol);
        return distance >= farApartConstraint.minDistance;
      }
      return true; // Other student not assigned yet, constraint can't be violated
    }
      
    case CONSTRAINT_TYPES.FAR_APART: {
      // Two students should be far apart (at least minDistance)
      const farApartConstraint = constraint as FarApartConstraint;
      const otherStudent = student === student1 ? farApartConstraint.student2 : student1;
      const otherPos = findStudent(otherStudent, seating);
      
      if (otherPos) {
        const [otherRow, otherCol] = otherPos;
        const distance = calculateDistance(row, col, otherRow, otherCol);
        return distance >= farApartConstraint.minDistance;
      }
      return true; // Other student not assigned yet, constraint can't be violated
    }
      
    default:
      return true;
  }
}

/**
 * Find position of a student in seating chart
 */
function findStudent(student: string, seating: Seating): [number, number] | null {
  for (let r = 0; r < seating.length; r++) {
    for (let c = 0; c < seating[r].length; c++) {
      if (seating[r][c] === student) {
        return [r, c];
      }
    }
  }
  return null;
}

/**
 * Check if two positions are adjacent (horizontally or vertically)
 */
function areAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);
}

/**
 * Calculate Euclidean distance between two positions in the grid
 */
function calculateDistance(row1: number, col1: number, row2: number, col2: number): number {
  const rowDiff = row1 - row2;
  const colDiff = col1 - col2;
  return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
}

function hasAdjacentEmptySeat(row: number, col: number, seating: Seating, rows: number, cols: number, layout: boolean[][]): boolean {
  const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      // Check if the seat is available in the layout and not yet assigned
      if (layout[newRow][newCol] && seating[newRow][newCol] === null) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Deep copy a 2D array
 */
function deepCopy(arr: Seating): Seating {
  return arr.map(row => [...row]);
}
