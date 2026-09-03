import { describe, it, expect } from 'vitest';
import { calculateGPATrend } from '../gpaTrendCalculator';

describe('GPA Trend Calculator Utility', () => {
  it('detects improving GPA trajectory across semesters', () => {
    const trend = calculateGPATrend([2.8, 3.1, 3.4]);
    expect(trend.trend).toBe('improving');
    expect(trend.delta).toBe(0.3);
    expect(trend.onProbation).toBe(false);
  });

  it('detects declining GPA trajectory and flags probation when below 2.0', () => {
    const trend = calculateGPATrend([2.5, 2.1, 1.8]);
    expect(trend.trend).toBe('declining');
    expect(trend.delta).toBe(-0.3);
    expect(trend.onProbation).toBe(true);
  });

  it('handles single semester gracefully as stable', () => {
    const trend = calculateGPATrend([3.5]);
    expect(trend.trend).toBe('stable');
    expect(trend.delta).toBe(0);
  });
});
