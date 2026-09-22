export interface StudentCase {
  id: string;
  name: string;
  riskScore: number; // 0 - 100
  failedCourses: number;
  attendanceRate: number; // 0 - 100
}

export function rankInterventionPriority(students: StudentCase[]): (StudentCase & { priorityIndex: number })[] {
  if (!students || students.length === 0) return [];

  const ranked = students.map(student => {
    // Composite priority index: higher score means more urgent intervention needed
    const priorityIndex =
      student.riskScore * 0.5 +
      student.failedCourses * 15 +
      (100 - student.attendanceRate) * 0.35;

    return {
      ...student,
      priorityIndex: Math.round(priorityIndex * 10) / 10
    };
  });

  return ranked.sort((a, b) => b.priorityIndex - a.priorityIndex);
}
