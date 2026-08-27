import { describe, it, expect } from 'vitest';
import { analyzeAttendance } from '../attendanceAnalyzer';

describe('Attendance Analyzer Utility', () => {
  it('identifies good attendance when attendance rate is high', () => {
    const records = [
      { attended: true },
      { attended: true },
      { attended: true },
      { attended: true }
    ];
    const res = analyzeAttendance(records);

    expect(res.attendancePercentage).toBe(100);
    expect(res.needsIntervention).toBe(false);
    expect(res.statusBadge).toBe('Good');
  });

  it('triggers intervention when unexcused absences reach threshold', () => {
    const records = [
      { attended: false, excused: false },
      { attended: false, excused: false },
      { attended: false, excused: false },
      { attended: true }
    ];
    const res = analyzeAttendance(records);

    expect(res.unexcusedCount).toBe(3);
    expect(res.needsIntervention).toBe(true);
    expect(res.statusBadge).toBe('Severe Truancy');
  });
});
