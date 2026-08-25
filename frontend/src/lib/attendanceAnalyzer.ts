export interface AttendanceAnalysis {
  attendancePercentage: number;
  unexcusedCount: number;
  needsIntervention: boolean;
  statusBadge: string;
}

export function analyzeAttendance(records: { attended: boolean; excused?: boolean }[]): AttendanceAnalysis {
  if (!records || records.length === 0) {
    return {
      attendancePercentage: 100,
      unexcusedCount: 0,
      needsIntervention: false,
      statusBadge: 'Good'
    };
  }

  let attendedCount = 0;
  let unexcusedCount = 0;

  for (const r of records) {
    if (r.attended) {
      attendedCount++;
    } else if (!r.excused) {
      unexcusedCount++;
    }
  }

  const attendancePercentage = Math.round((attendedCount / records.length) * 100);
  const needsIntervention = attendancePercentage < 75 || unexcusedCount >= 3;

  let statusBadge = 'Good';
  if (attendancePercentage < 70) {
    statusBadge = 'Severe Truancy';
  } else if (attendancePercentage < 80) {
    statusBadge = 'At Risk';
  } else if (attendancePercentage < 90) {
    statusBadge = 'Caution';
  }

  return {
    attendancePercentage,
    unexcusedCount,
    needsIntervention,
    statusBadge
  };
}
