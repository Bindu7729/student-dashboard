import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges single and multiple tailwind class strings', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional class values correctly', () => {
    expect(cn('base-class', true && 'is-active', false && 'is-hidden')).toBe('base-class is-active');
  });

  it('resolves conflicting tailwind classes with precedence to the latter', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles empty and undefined inputs gracefully', () => {
    expect(cn(undefined, null, '', 'text-white')).toBe('text-white');
  });
});