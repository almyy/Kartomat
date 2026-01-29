/**
 * Constraint Satisfaction Problem Solver for Classroom Seating
 */

// Constraint types
export const CONSTRAINT_TYPES = {
  NOT_TOGETHER: 'not_together',
  TOGETHER: 'together',
  MUST_BE_IN_ROW: 'must_be_in_row'
};

/**
 * Solves the classroom seating CSP using backtracking with constraint propagation
 * @param {Array<string>} students - List of student names
 * @param {Array<Object>} constraints - List of constraints
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns per row
 * @returns {Object} Solution with seating arrangement or null if no solution
 */
export function solveSeatingCSP(students, constraints, rows, cols) {
  const totalSeats = rows * cols;
  
  if (students.length > totalSeats) {
    return { success: false, message: 'Not enough seats for all students' };
  }
  
  // Initialize empty seating chart (row, col) -> student name
  const seating = Array(rows).fill(null).map(() => Array(cols).fill(null));
  const assignedStudents = new Set();
  
  // Try to solve using backtracking
  const solution = backtrack(students, constraints, seating, assignedStudents, rows, cols);
  
  if (solution) {
    return { success: true, seating: solution };
  } else {
    return { success: false, message: 'No valid seating arrangement found. Try relaxing some constraints.' };
  }
}

/**
 * Backtracking algorithm to find valid seating arrangement
 */
function backtrack(students, constraints, seating, assigned, rows, cols) {
  // Base case: all students assigned
  if (assigned.size === students.length) {
    return deepCopy(seating);
  }
  
  // Select next unassigned student
  const student = students.find(s => !assigned.has(s));
  
  // Try each available seat
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (seating[row][col] === null) {
        // Try assigning student to this seat
        seating[row][col] = student;
        assigned.add(student);
        
        // Check if this assignment satisfies all constraints
        if (isConsistent(student, row, col, seating, constraints, rows, cols)) {
          // Recurse
          const result = backtrack(students, constraints, seating, assigned, rows, cols);
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
function isConsistent(student, row, col, seating, constraints, rows, cols) {
  // Check all constraints involving this student
  for (const constraint of constraints) {
    if (constraint.student1 === student || constraint.student2 === student) {
      if (!checkConstraint(constraint, student, row, col, seating, rows, cols)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a specific constraint is satisfied
 */
function checkConstraint(constraint, student, row, col, seating, rows, cols) {
  const { type, student1, student2, row: constraintRow } = constraint;
  
  switch (type) {
    case CONSTRAINT_TYPES.MUST_BE_IN_ROW:
      // Student must be in a specific row
      if (student === student1) {
        return row === constraintRow;
      }
      return true;
      
    case CONSTRAINT_TYPES.NOT_TOGETHER:
      // Two students should not be adjacent
      const otherStudent = student === student1 ? student2 : student1;
      const otherPos = findStudent(otherStudent, seating);
      
      if (otherPos) {
        const [otherRow, otherCol] = otherPos;
        return !areAdjacent(row, col, otherRow, otherCol);
      }
      return true; // Other student not assigned yet, constraint can't be violated
      
    case CONSTRAINT_TYPES.TOGETHER:
      // Two students should be adjacent
      const partnerStudent = student === student1 ? student2 : student1;
      const partnerPos = findStudent(partnerStudent, seating);
      
      if (partnerPos) {
        const [partnerRow, partnerCol] = partnerPos;
        return areAdjacent(row, col, partnerRow, partnerCol);
      }
      // If partner not assigned yet, we need to check if there's an adjacent empty seat
      return hasAdjacentEmptySeat(row, col, seating, rows, cols);
      
    default:
      return true;
  }
}

/**
 * Find position of a student in seating chart
 */
function findStudent(student, seating) {
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
function areAdjacent(row1, col1, row2, col2) {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);
}

/**
 * Check if there's an adjacent empty seat
 */
function hasAdjacentEmptySeat(row, col, seating, rows, cols) {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      if (seating[newRow][newCol] === null) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Deep copy a 2D array
 */
function deepCopy(arr) {
  return arr.map(row => [...row]);
}
