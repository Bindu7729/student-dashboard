import { describe, it, expect } from 'vitest';
import { evaluateStudentRisk } from '../riskCategorizer';

describe('Risk Categorizer Utility', () => {
  it('identifies critical risk profiles when dropout probability and missing work are high', () => {
    const profile = evaluateStudentRisk(0.85, 6);
    expect(profile.tier).toBe('Critical');
    expect(profile.alertLevel).toBe('error');
    expect(profile.recommendedActions).toContain('Immediate counselor outreach');
    expect(profile.riskScore).toBeGreaterThanOrEqual(75);
  });

  it('identifies moderate risk when probability is moderate', () => {
    const profile = evaluateStudentRisk(0.40, 1);
    expect(profile.tier).toBe('Moderate');
    expect(profile.alertLevel).toBe('warning');
  });

  it('categorizes well-performing students as Low risk', () => {
    const profile = evaluateStudentRisk(0.10, 0);
    expect(profile.tier).toBe('Low');
    expect(profile.alertLevel).toBe('info');
    expect(profile.riskScore).toBeLessThan(25);
  });
});
