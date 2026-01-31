/**
 * Constraint Satisfaction Problem Solver for Classroom Seating
 */

// Constraint types
export const CONSTRAINT_TYPES = {
  NOT_TOGETHER: 'not_together',
  TOGETHER: 'together',
  MUST_BE_IN_ROW: 'must_be_in_row',
  FAR_APART: 'far_apart',
  ABSOLUTE: 'absolute'
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

export interface AbsoluteConstraint extends BaseConstraint {
  type: typeof CONSTRAINT_TYPES.ABSOLUTE;
  row: number;
  col: number;
}

export type Constraint = PairConstraint | RowConstraint | FarApartConstraint | AbsoluteConstraint;

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
  layout?: boolean[][],
  seatGenders?: ('male' | 'female' | 'any')[][],
  studentGenders?: Record<string, 'male' | 'female' | undefined>
): SeatingResult {
  // Use default layout if not provided (all seats available)
  const seatLayout = layout || Array(rows).fill(null).map(() => Array(cols).fill(true));
  const genderRestrictions = seatGenders || Array(rows).fill(null).map(() => Array(cols).fill('any'));

  // Count available seats
  const availableSeats = seatLayout.flat().filter(seat => seat).length;

  if (students.length > availableSeats) {
    return { success: false, message: 'Not enough available seats for all students' };
  }

  // Initialize empty seating chart (row, col) -> student name
  const seating: Seating = Array(rows).fill(null).map(() => Array(cols).fill(null));
  const assignedStudents = new Set<string>();

  // Try to solve using backtracking
  const solution = backtrack(students, constraints, seating, assignedStudents, rows, cols, seatLayout, genderRestrictions, studentGenders || {});

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
  layout: boolean[][],
  seatGenders: ('male' | 'female' | 'any')[][],
  studentGenders: Record<string, 'male' | 'female' | undefined>
): Seating | null {
  // Base case: all students assigned
  if (assigned.size === students.length) {
    return deepCopy(seating);
  }

  // Select next unassigned student using Most Constrained Variable heuristic
  const student = selectMostConstrainedStudent(students, assigned, constraints);

  if (!student) {
    return null;
  }

  // Get valid positions for this student based on constraints and gender
  const validPositions = getValidPositions(student, constraints, seating, rows, cols, layout, seatGenders, studentGenders);

  // Sort positions front-to-back, left-to-right for compact placement
  // This ensures students are placed together rather than spread out
  sortPositionsFrontToBack(validPositions);

  // Try each valid position
  for (const [row, col] of validPositions) {
    // Try assigning student to this seat
    seating[row][col] = student;
    assigned.add(student);

    // Check if this assignment satisfies all constraints
    if (isConsistent(student, row, col, seating, constraints, rows, cols, layout)) {
      // Recurse
      const result = backtrack(students, constraints, seating, assigned, rows, cols, layout, seatGenders, studentGenders);
      if (result) {
        return result;
      }
    }

    // Backtrack
    seating[row][col] = null;
    assigned.delete(student);
  }

  return null;
}

/**
 * Select the most constrained unassigned student
 * Prioritizes students with absolute constraints, then those with together constraints
 */
function selectMostConstrainedStudent(
  students: string[],
  assigned: Set<string>,
  constraints: Constraint[],
): string | undefined {
  const unassigned = students.filter(s => !assigned.has(s));

  if (unassigned.length === 0) {
    return undefined;
  }

  // First, check for students with absolute constraints
  for (const student of unassigned) {
    const hasAbsolute = constraints.some(
      c => c.type === CONSTRAINT_TYPES.ABSOLUTE && c.student1 === student
    );
    if (hasAbsolute) {
      return student;
    }
  }

  // Next, prioritize students whose partner in a "together" constraint is already assigned
  for (const student of unassigned) {
    const togetherConstraint = constraints.find(
      c => c.type === CONSTRAINT_TYPES.TOGETHER &&
           (c.student1 === student || ('student2' in c && c.student2 === student))
    ) as PairConstraint | undefined;

    if (togetherConstraint) {
      const partner = togetherConstraint.student1 === student
        ? togetherConstraint.student2
        : togetherConstraint.student1;

      if (assigned.has(partner)) {
        return student;
      }
    }
  }

  // Count constraints for remaining students and pick the most constrained
  let mostConstrained = unassigned[0];
  let maxConstraints = 0;

  for (const student of unassigned) {
    const count = constraints.filter(
      c => c.student1 === student || ('student2' in c && c.student2 === student)
    ).length;

    if (count > maxConstraints) {
      maxConstraints = count;
      mostConstrained = student;
    }
  }

  return mostConstrained;
}

/**
 * Get valid positions for a student based on their constraints
 * This reduces the search space significantly
 */
function getValidPositions(
  student: string,
  constraints: Constraint[],
  seating: Seating,
  rows: number,
  cols: number,
  layout: boolean[][],
  seatGenders: ('male' | 'female' | 'any')[][],
  studentGenders: Record<string, 'male' | 'female' | undefined>
): [number, number][] {
  const positions: [number, number][] = [];
  const studentGender = studentGenders[student];

  // Helper to check if student can sit in a seat based on gender
  const canSitHere = (row: number, col: number): boolean => {
    const seatRestriction = seatGenders[row][col];
    if (seatRestriction === 'any') return true;
    if (!studentGender) return true; // Student with no gender can sit anywhere
    return seatRestriction === studentGender;
  };

  // Check for absolute constraint - only one valid position
  const absoluteConstraint = constraints.find(
    c => c.type === CONSTRAINT_TYPES.ABSOLUTE && c.student1 === student
  ) as AbsoluteConstraint | undefined;

  if (absoluteConstraint) {
    const { row, col } = absoluteConstraint;
    if (layout[row][col] && seating[row][col] === null && canSitHere(row, col)) {
      return [[row, col]];
    }
    return []; // Constraint cannot be satisfied
  }

  // Check for row constraint - only positions in that row
  const rowConstraint = constraints.find(
    c => c.type === CONSTRAINT_TYPES.MUST_BE_IN_ROW && c.student1 === student
  ) as RowConstraint | undefined;

  if (rowConstraint) {
    for (let col = 0; col < cols; col++) {
      if (layout[rowConstraint.row][col] && seating[rowConstraint.row][col] === null && canSitHere(rowConstraint.row, col)) {
        positions.push([rowConstraint.row, col]);
      }
    }
    return positions;
  }

  // Check for together constraint with already-assigned partner
  const togetherConstraint = constraints.find(
    c => c.type === CONSTRAINT_TYPES.TOGETHER &&
         (c.student1 === student || ('student2' in c && c.student2 === student))
  ) as PairConstraint | undefined;

  if (togetherConstraint) {
    const partner = togetherConstraint.student1 === student
      ? togetherConstraint.student2
      : togetherConstraint.student1;

    const partnerPos = findStudent(partner, seating);
    if (partnerPos) {
      // Only consider horizontally adjacent positions to the partner (same row)
      const [partnerRow, partnerCol] = partnerPos;
      const directions: [number, number][] = [[0, -1], [0, 1]]; // left and right only

      for (const [dr, dc] of directions) {
        const newRow = partnerRow + dr;
        const newCol = partnerCol + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          if (layout[newRow][newCol] && seating[newRow][newCol] === null && canSitHere(newRow, newCol)) {
            positions.push([newRow, newCol]);
          }
        }
      }
      return positions;
    }
  }

  // Default: all empty seats that match gender restriction
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (layout[row][col] && seating[row][col] === null && canSitHere(row, col)) {
        positions.push([row, col]);
      }
    }
  }

  return positions;
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
    case CONSTRAINT_TYPES.ABSOLUTE: {
      // Student must be placed at a specific seat (row, col)
      const absoluteConstraint = constraint as AbsoluteConstraint;
      if (student === student1) {
        // Check if current student is at the required position
        return row === absoluteConstraint.row && col === absoluteConstraint.col;
      } else {
        // Check if current position is reserved for another student
        if (row === absoluteConstraint.row && col === absoluteConstraint.col) {
          return false; // This position is reserved for student1
        }
      }
      return true;
    }

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
 * Check if two positions are adjacent (horizontally on the same row only)
 */
function areAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return rowDiff === 0 && colDiff === 1;
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
  const directions: [number, number][] = [[0, -1], [0, 1]]; // left and right only

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

/**
 * Sort positions front-to-back (by row), with randomness within each row
 * This ensures compact seating arrangement with students placed together
 * while maintaining variety between different solutions
 */
function sortPositionsFrontToBack(positions: [number, number][]): void {
  // First, sort by row to ensure front-to-back placement
  positions.sort((a, b) => a[0] - b[0]);
  
  // Then shuffle positions within each row to add randomness
  // Group positions by row
  const rowGroups = new Map<number, [number, number][]>();
  for (const pos of positions) {
    const row = pos[0];
    if (!rowGroups.has(row)) {
      rowGroups.set(row, []);
    }
    rowGroups.get(row)!.push(pos);
  }
  
  // Shuffle each row's positions
  for (const rowPositions of rowGroups.values()) {
    shuffleArray(rowPositions);
  }
  
  // Reconstruct positions array with shuffled rows
  positions.length = 0;
  for (const row of Array.from(rowGroups.keys()).sort((a, b) => a - b)) {
    positions.push(...rowGroups.get(row)!);
  }
}

/**
 * Fisher-Yates shuffle algorithm to randomize array in-place
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
