import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

jest.mock('axios');

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have null user and token from localStorage', () => {
      const store = useAuthStore();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBeFalsy();
    });

    it('should load token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      const store = useAuthStore();
      expect(store.token).toBe('test-token');
      expect(store.isAuthenticated).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            nome: 'Test User',
            login: 'testuser'
          },
          token: 'test-token'
        }
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      await store.login('testuser', 'password');

      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe(mockResponse.data.token);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });

    it('should handle login error', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('Login failed'));

      const store = useAuthStore();
      await expect(store.login('testuser', 'password')).rejects.toThrow('Login failed');

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            nome: 'Test User',
            login: 'testuser'
          },
          token: 'test-token'
        }
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      await store.register('Test User', 'testuser', 'password');

      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe(mockResponse.data.token);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });

    it('should handle registration error', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('Registration failed'));

      const store = useAuthStore();
      await expect(store.register('Test User', 'testuser', 'password')).rejects.toThrow('Registration failed');

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user data and token', () => {
      localStorage.setItem('token', 'test-token');
      axios.defaults.headers.common['Authorization'] = 'Bearer test-token';

      const store = useAuthStore();
      store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });
}); 