import { useAuthStore } from '@/stores/auth';
import { setActivePinia, createPinia } from 'pinia';
import api from '@/services/api';

// Mock do api com os métodos necessários
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }
}));

const mockedApi = api as jest.Mocked<typeof api>;

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
          user: { id: 1, nome: 'Test User', login: 'test' },
          token: 'test-token',
        },
      };

      mockedApi.post.mockResolvedValueOnce(mockResponse);
      (localStorage.setItem as jest.Mock).mockImplementation((key, value) => {
        if (key === 'token') {
          (localStorage.getItem as jest.Mock).mockReturnValue(value);
        }
      });

      const store = useAuthStore();
      await store.login({ login: 'test', senha: 'password' });

      expect(mockedApi.post).toHaveBeenCalledWith('/api/users/login', {
        login: 'test',
        senha: 'password',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should handle login error', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Login failed'));

      const store = useAuthStore();
      await expect(store.login({ login: 'test', senha: 'password' })).rejects.toThrow('Login failed');

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, nome: 'Test User', login: 'test' },
          token: 'test-token',
        },
      };

      mockedApi.post.mockResolvedValueOnce(mockResponse);
      (localStorage.setItem as jest.Mock).mockImplementation((key, value) => {
        if (key === 'token') {
          (localStorage.getItem as jest.Mock).mockReturnValue(value);
        }
      });

      const store = useAuthStore();
      await store.register({ nome: 'Test User', login: 'test', senha: 'password' });

      expect(mockedApi.post).toHaveBeenCalledWith('/api/users/register', {
        nome: 'Test User',
        login: 'test',
        senha: 'password',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(store.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should handle registration error', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Registration failed'));

      const store = useAuthStore();
      await expect(store.register({ nome: 'Test User', login: 'test', senha: 'password' })).rejects.toThrow('Registration failed');

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
    });
  });
}); 