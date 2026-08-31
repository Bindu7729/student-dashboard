export interface GPATrend {
  currentGPA: number;
  previousGPA: number;
  delta: number;
  trend: 'improving' | 'declining' | 'stable';
  onProbation: boolean;
}

export function calculateGPATrend(semesterGPAs: number[]): GPATrend {
  if (!semesterGPAs || semesterGPAs.length === 0) {
    return {
      currentGPA: 0,
      previousGPA: 0,
      delta: 0,
      trend: 'stable',
      onProbation: false
    };
  }

  const currentGPA = semesterGPAs[semesterGPAs.length - 1];
  const previousGPA = semesterGPAs.length > 1 ? semesterGPAs[semesterGPAs.length - 2] : currentGPA;
  const delta = Math.round((currentGPA - previousGPA) * 100) / 100;

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (delta > 0.05) {
    trend = 'improving';
  } else if (delta < -0.05) {
    trend = 'declining';
  }

  const onProbation = currentGPA < 2.0;

  return {
    currentGPA,
    previousGPA,
    delta,
    trend,
    onProbation
  };
}
