export interface RiskProfile {
  tier: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;
  alertLevel: 'info' | 'warning' | 'error';
  recommendedActions: string[];
}

export function evaluateStudentRisk(dropoutProbability: number, missingAssignments: number = 0): RiskProfile {
  const prob = Math.max(0, Math.min(1, dropoutProbability));
  const rawScore = Math.round((prob * 70) + (Math.min(10, missingAssignments) * 3));
  const riskScore = Math.min(100, rawScore);

  if (riskScore >= 75) {
    return {
      tier: 'Critical',
      riskScore,
      alertLevel: 'error',
      recommendedActions: ['Immediate counselor outreach', 'Academic advisor review', 'Parent/guardian notification']
    };
  }

  if (riskScore >= 50) {
    return {
      tier: 'High',
      riskScore,
      alertLevel: 'warning',
      recommendedActions: ['Schedule tutoring session', 'Course progress check-in']
    };
  }

  if (riskScore >= 25) {
    return {
      tier: 'Moderate',
      riskScore,
      alertLevel: 'warning',
      recommendedActions: ['Monitor attendance and upcoming submissions']
    };
  }

  return {
    tier: 'Low',
    riskScore,
    alertLevel: 'info',
    recommendedActions: ['Standard academic cadence']
  };
}
