/// <reference types="jest" />
import '@testing-library/jest-dom';
import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as Storage;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Create Vue app for testing
const app = createApp({});
const pinia = createPinia();
app.use(pinia);
setActivePinia(pinia);

// Setup global mocks
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

// Mock api module
jest.mock('@/services/api', () => ({
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

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  (localStorage.getItem as jest.Mock).mockImplementation((key: string) => null);
});

// Basic test to satisfy Jest's requirement
describe('Test Setup', () => {
  it('should have Pinia configured', () => {
    expect(pinia).toBeDefined();
  });
}); 