import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore (Zustand)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('authenticates user and sets token on login', () => {
    const mockUser = {
      id: 1,
      name: 'Faculty Dean',
      email: 'dean@university.edu',
      role: 'DEAN' as const
    };

    useAuthStore.getState().login(mockUser, 'test-jwt-token-123');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('test-jwt-token-123');
    expect(state.user?.name).toBe('Faculty Dean');
    expect(state.user?.role).toBe('DEAN');
  });

  it('clears session on logout', () => {
    const mockUser = {
      id: 2,
      name: 'Student Candidate',
      email: 'student@university.edu',
      role: 'STUDENT' as const,
      student_id: 'STU_001'
    };

    useAuthStore.getState().login(mockUser, 'token-xyz');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});