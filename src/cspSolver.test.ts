import { describe, it, expect } from 'vitest';
import {solveSeatingCSP, CONSTRAINT_TYPES, Constraint} from './cspSolver';

describe('CSP Solver - Basic Functionality', () => {
  it('should solve a simple 2x2 classroom with 3 students', () => {
    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], [], 2, 2);

    expect(result.success).toBe(true);
    expect(result.seating).toBeDefined();

    // Count placed students
    const placedStudents = result.seating!.flat().filter(s => s !== null);
    expect(placedStudents).toHaveLength(3);
  });

  it('should fail when there are not enough seats', () => {
    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], [], 1, 1);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Not enough available seats');
  });

  it('should handle empty student list', () => {
    const result = solveSeatingCSP([], [], 2, 2);

    expect(result.success).toBe(true);
    expect(result.seating).toBeDefined();
  });
});

describe('CSP Solver - Absolute Constraints', () => {
  it('should place student at absolute position', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Alice', row: 1, col: 1 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 3, 3);

    expect(result.success).toBe(true);
    expect(result.seating![1][1]).toBe('Alice');
  });

  it('should handle multiple absolute constraints', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Alice', row: 0, col: 0 },
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Bob', row: 2, col: 2 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], constraints, 3, 3);

    expect(result.success).toBe(true);
    expect(result.seating![0][0]).toBe('Alice');
    expect(result.seating![2][2]).toBe('Bob');
  });

  it('should fail with conflicting absolute constraints', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Alice', row: 0, col: 0 },
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Bob', row: 0, col: 0 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 2, 2);

    expect(result.success).toBe(false);
  });
});

describe('CSP Solver - Together Constraints', () => {
  it('should place two students adjacent to each other', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.TOGETHER, student1: 'Alice', student2: 'Bob' }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], constraints, 3, 3);

    expect(result.success).toBe(true);

    // Find Alice and Bob
    let alicePos: [number, number] | null = null;
    let bobPos: [number, number] | null = null;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (result.seating![r][c] === 'Alice') alicePos = [r, c];
        if (result.seating![r][c] === 'Bob') bobPos = [r, c];
      }
    }

    expect(alicePos).toBeTruthy();
    expect(bobPos).toBeTruthy();

    // Check they are adjacent
    const rowDiff = Math.abs(alicePos![0] - bobPos![0]);
    const colDiff = Math.abs(alicePos![1] - bobPos![1]);
    const isAdjacent = (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);

    expect(isAdjacent).toBe(true);
  });

  it('should work with absolute and together constraints', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Alice', row: 0, col: 0 },
      { type: CONSTRAINT_TYPES.TOGETHER, student1: 'Alice', student2: 'Bob' }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 3, 3);

    expect(result.success).toBe(true);
    expect(result.seating![0][0]).toBe('Alice');

    // Bob should be adjacent to Alice (either at [0,1] or [1,0])
    const bobAt01 = result.seating![0][1] === 'Bob';
    const bobAt10 = result.seating![1][0] === 'Bob';
    expect(bobAt01 || bobAt10).toBe(true);
  });
});

describe('CSP Solver - Not Together Constraints', () => {
  it('should place two students non-adjacent', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.NOT_TOGETHER, student1: 'Alice', student2: 'Bob' }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 3, 3);

    expect(result.success).toBe(true);

    // Find Alice and Bob
    let alicePos: [number, number] | null = null;
    let bobPos: [number, number] | null = null;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (result.seating![r][c] === 'Alice') alicePos = [r, c];
        if (result.seating![r][c] === 'Bob') bobPos = [r, c];
      }
    }

    expect(alicePos).toBeTruthy();
    expect(bobPos).toBeTruthy();

    // Check they are NOT adjacent
    const rowDiff = Math.abs(alicePos![0] - bobPos![0]);
    const colDiff = Math.abs(alicePos![1] - bobPos![1]);
    const isAdjacent = (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);

    expect(isAdjacent).toBe(false);
  });
});

describe('CSP Solver - Row Constraints', () => {
  it('should place student in specified row', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'Alice', row: 1 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 3, 3);

    expect(result.success).toBe(true);

    // Find Alice
    let aliceRow = -1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (result.seating![r][c] === 'Alice') {
          aliceRow = r;
        }
      }
    }

    expect(aliceRow).toBe(1);
  });

  it('should handle multiple row constraints', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'Alice', row: 0 },
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'Bob', row: 2 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], constraints, 3, 3);

    expect(result.success).toBe(true);

    // Find students
    let aliceRow = -1, bobRow = -1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (result.seating![r][c] === 'Alice') aliceRow = r;
        if (result.seating![r][c] === 'Bob') bobRow = r;
      }
    }

    expect(aliceRow).toBe(0);
    expect(bobRow).toBe(2);
  });
});

describe('CSP Solver - Far Apart Constraints', () => {
  it('should place students far apart', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.FAR_APART, student1: 'Alice', student2: 'Bob', minDistance: 3 }
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], constraints, 5, 5);

    expect(result.success).toBe(true);

    // Find Alice and Bob
    let alicePos: [number, number] | null = null;
    let bobPos: [number, number] | null = null;

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (result.seating![r][c] === 'Alice') alicePos = [r, c];
        if (result.seating![r][c] === 'Bob') bobPos = [r, c];
      }
    }

    expect(alicePos).toBeTruthy();
    expect(bobPos).toBeTruthy();

    // Check distance
    const rowDiff = alicePos![0] - bobPos![0];
    const colDiff = alicePos![1] - bobPos![1];
    const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);

    expect(distance).toBeGreaterThanOrEqual(3);
  });
});

describe('CSP Solver - Custom Layouts', () => {
  it('should respect custom layout with unavailable seats', () => {
    const layout = [
      [true, false, true],
      [true, true, true],
      [false, true, true]
    ];

    const result = solveSeatingCSP(['Alice', 'Bob', 'Charlie'], [], 3, 3, layout);

    expect(result.success).toBe(true);

    // Check that no students are placed in unavailable seats
    expect(result.seating![0][1]).toBeNull();
    expect(result.seating![2][0]).toBeNull();
  });

  it('should fail when custom layout has insufficient seats', () => {
    const layout = [
      [true, false],
      [false, false]
    ];

    const result = solveSeatingCSP(['Alice', 'Bob'], [], 2, 2, layout);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Not enough available seats');
  });
});

describe('CSP Solver - Performance Bug Fix', () => {
  it('should solve the problematic 26-student case quickly', () => {
    const students = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const layout = [
      [true, true, false, true, true, false, true, true],
      [true, true, false, true, true, false, true, true],
      [true, true, false, true, true, false, true, true],
      [true, true, false, true, true, false, true, true],
      [true, true, false, true, false, false, false, false]
    ];
    const constraints: Constraint[] = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'A', row: 0, col: 0 },
      { type: CONSTRAINT_TYPES.TOGETHER, student1: 'A', student2: 'B' },
      { type: CONSTRAINT_TYPES.FAR_APART, student1: 'A', student2: 'V', minDistance: 5 },
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'D', row: 0 },
      { type: CONSTRAINT_TYPES.TOGETHER, student1: 'N', student2: 'W' },
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'Z', row: 1 }
    ];

    const startTime = Date.now();
    const result = solveSeatingCSP(students, constraints, 5, 8, layout);
    const elapsed = Date.now() - startTime;

    // Should complete in under 1 second (was hanging before)
    expect(elapsed).toBeLessThan(1000);

    // Should find a solution
    expect(result.success).toBe(true);

    if (result.success) {
      // Verify key constraints
      expect(result.seating![0][0]).toBe('A');

      // B should be adjacent to A
      const bAt01 = result.seating![0][1] === 'B';
      const bAt10 = result.seating![1][0] === 'B';
      expect(bAt01 || bAt10).toBe(true);

      // D should be in row 0
      const dInRow0 = result.seating![0].includes('D');
      expect(dInRow0).toBe(true);

      // Z should be in row 1
      const zInRow1 = result.seating![1].includes('Z');
      expect(zInRow1).toBe(true);
    }
  });

  it('should handle large classrooms efficiently', () => {
    const students = Array.from({ length: 50 }, (_, i) => `Student${i + 1}`);

    const startTime = Date.now();
    const result = solveSeatingCSP(students, [], 10, 10);
    const elapsed = Date.now() - startTime;

    // Should complete quickly even with many students
    expect(elapsed).toBeLessThan(5000);
    expect(result.success).toBe(true);
  });
});

describe('CSP Solver - Mixed Complex Constraints', () => {
  it('should handle multiple constraint types together', () => {
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'Alice', row: 0, col: 0 },
      { type: CONSTRAINT_TYPES.TOGETHER, student1: 'Bob', student2: 'Charlie' },
      { type: CONSTRAINT_TYPES.NOT_TOGETHER, student1: 'Alice', student2: 'David' },
      { type: CONSTRAINT_TYPES.MUST_BE_IN_ROW, student1: 'Eve', row: 2 }
    ];

    const result = solveSeatingCSP(
      ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
      constraints,
      3,
      3
    );

    expect(result.success).toBe(true);

    // Verify Alice is at (0,0)
    expect(result.seating![0][0]).toBe('Alice');

    // Verify Bob and Charlie are adjacent
    let bobPos: [number, number] | null = null;
    let charliePos: [number, number] | null = null;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (result.seating![r][c] === 'Bob') bobPos = [r, c];
        if (result.seating![r][c] === 'Charlie') charliePos = [r, c];
      }
    }

    if (bobPos && charliePos) {
      const rowDiff = Math.abs(bobPos[0] - charliePos[0]);
      const colDiff = Math.abs(bobPos[1] - charliePos[1]);
      const isAdjacent = (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);
      expect(isAdjacent).toBe(true);
    }
  });
});

describe('CSP Solver - Compact Placement', () => {
  it('should place students from front to back when there are more seats than students', () => {
    const students = ['Alice', 'Bob', 'Charlie'];
    const result = solveSeatingCSP(students, [], 3, 3);

    expect(result.success).toBe(true);
    
    // Students should be in the first row(s), not spread out
    // Count students in each row
    const row0Count = result.seating![0].filter(s => s !== null).length;
    const row1Count = result.seating![1].filter(s => s !== null).length;
    const row2Count = result.seating![2].filter(s => s !== null).length;
    
    // First row should be filled before second row
    if (row1Count > 0) {
      expect(row0Count).toBe(3); // First row should be full
    }
    
    // Third row should be empty since we only have 3 students
    expect(row2Count).toBe(0);
  });

  it('should place students together from front to back in a large classroom', () => {
    const students = ['A', 'B', 'C', 'D', 'E'];
    const result = solveSeatingCSP(students, [], 5, 5); // 25 seats for 5 students

    expect(result.success).toBe(true);
    
    // All students should be in the first row (or first two rows if first row has less than 5 columns)
    const row0Count = result.seating![0].filter(s => s !== null).length;
    const row1Count = result.seating![1].filter(s => s !== null).length;
    const row2Count = result.seating![2].filter(s => s !== null).length;
    const row3Count = result.seating![3].filter(s => s !== null).length;
    const row4Count = result.seating![4].filter(s => s !== null).length;
    
    // First row should be completely filled
    expect(row0Count).toBe(5);
    
    // All other rows should be empty
    expect(row1Count).toBe(0);
    expect(row2Count).toBe(0);
    expect(row3Count).toBe(0);
    expect(row4Count).toBe(0);
  });

  it('should place students front to back left to right without gaps', () => {
    const students = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const result = solveSeatingCSP(students, [], 3, 4); // 12 seats for 7 students

    expect(result.success).toBe(true);
    
    // Check first row is filled left to right
    expect(result.seating![0][0]).not.toBeNull();
    expect(result.seating![0][1]).not.toBeNull();
    expect(result.seating![0][2]).not.toBeNull();
    expect(result.seating![0][3]).not.toBeNull();
    
    // Check second row starts filling
    expect(result.seating![1][0]).not.toBeNull();
    expect(result.seating![1][1]).not.toBeNull();
    expect(result.seating![1][2]).not.toBeNull();
    
    // Rest of second row and third row should be empty
    expect(result.seating![1][3]).toBeNull();
    expect(result.seating![2].every(s => s === null)).toBe(true);
  });

  it('should still respect constraints while placing front to back', () => {
    const students = ['Alice', 'Bob', 'Charlie', 'David'];
    const constraints = [
      { type: CONSTRAINT_TYPES.ABSOLUTE, student1: 'David', row: 2, col: 2 }
    ];
    
    const result = solveSeatingCSP(students, constraints, 3, 3);

    expect(result.success).toBe(true);
    
    // David should be at (2, 2) as constrained
    expect(result.seating![2][2]).toBe('David');
    
    // Other students should fill from front
    const row0Count = result.seating![0].filter(s => s !== null).length;
    const row1Count = result.seating![1].filter(s => s !== null).length;
    
    // First row should have students
    expect(row0Count).toBeGreaterThan(0);
    
    // Students should be placed front-to-back except for David
    expect(result.seating![0][0]).not.toBeNull();
  });
});
