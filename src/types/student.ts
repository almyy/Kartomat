export type Gender = "male" | "female";

export interface Student {
  name: string;
  gender?: Gender;
}

export function getStudentName(student: Student | string): string {
  return typeof student === "string" ? student : student.name;
}

export function getStudentGender(
  student: Student | string,
): Gender | undefined {
  return typeof student === "string" ? undefined : student.gender;
}
