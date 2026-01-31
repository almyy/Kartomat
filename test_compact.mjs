import { solveSeatingCSP } from './src/cspSolver.ts';

// Test compact placement - 8 students in 4x6 classroom (24 seats)
const students = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const result = solveSeatingCSP(students, [], 4, 6);

console.log('Success:', result.success);
if (result.success && result.seating) {
  console.log('\nSeating arrangement:');
  result.seating.forEach((row, i) => {
    console.log(`Row ${i}:`, row.map(s => s || '  ').join(' | '));
  });
  
  // Count students per row
  console.log('\nStudents per row:');
  result.seating.forEach((row, i) => {
    const count = row.filter(s => s !== null).length;
    console.log(`Row ${i}: ${count} students`);
  });
}
