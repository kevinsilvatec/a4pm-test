import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { setActivePinia, createPinia } from 'pinia';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null user and token from localStorage', () => {
      const store = useAuthStore();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBeFalsy();
    });

    it('should load token from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      const store = useAuthStore();
      expect(store.token).toBe('test-token');
      expect(store.isAuthenticated).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com' },
          token: 'test-token',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      (localStorage.setItem as jest.Mock).mockImplementation((key, value) => {
        if (key === 'token') {
          (localStorage.getItem as jest.Mock).mockReturnValue(value);
        }
      });

      const store = useAuthStore();
      await store.login({ email: 'test@example.com', password: 'password' });

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });

    it('should handle login error', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Login failed'));

      const store = useAuthStore();
      await expect(store.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Login failed');

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com' },
          token: 'test-token',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      (localStorage.setItem as jest.Mock).mockImplementation((key, value) => {
        if (key === 'token') {
          (localStorage.getItem as jest.Mock).mockReturnValue(value);
        }
      });

      const store = useAuthStore();
      await store.register({ email: 'test@example.com', password: 'password' });

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });

    it('should handle registration error', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Registration failed'));

      const store = useAuthStore();
      await expect(store.register({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Registration failed');

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user data and token', () => {
      const store = useAuthStore();
      store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });
}); 