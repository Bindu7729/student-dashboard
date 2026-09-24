import { describe, it, expect } from 'vitest';
import { rankInterventionPriority } from '../interventionPriority';

describe('Intervention Priority Ranking Service', () => {
  it('correctly ranks students with highest composite risk at the top', () => {
    const students = [
      { id: '1', name: 'Student A', riskScore: 30, failedCourses: 0, attendanceRate: 95 },
      { id: '2', name: 'Student B', riskScore: 85, failedCourses: 2, attendanceRate: 60 },
      { id: '3', name: 'Student C', riskScore: 60, failedCourses: 1, attendanceRate: 80 }
    ];

    const ranked = rankInterventionPriority(students);

    expect(ranked[0].id).toBe('2'); // Student B most urgent
    expect(ranked[1].id).toBe('3'); // Student C second
    expect(ranked[2].id).toBe('1'); // Student A least urgent
    expect(ranked[0].priorityIndex).toBeGreaterThan(ranked[1].priorityIndex);
  });

  it('handles empty student list gracefully', () => {
    expect(rankInterventionPriority([])).toEqual([]);
  });
});
