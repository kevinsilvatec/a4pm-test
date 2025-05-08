import { defineStore } from 'pinia';
import api from '@/services/api';

interface User {
  id: number;
  nome: string;
  login: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: { login: string; senha: string }) {
      try {
        const response = await api.post('/api/users/login', credentials);
        const { user, token } = response.data;
        
        this.user = user;
        this.token = token;
        localStorage.setItem('token', token);
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        throw error;
      }
    },

    async register(credentials: { nome: string; login: string; senha: string }) {
      try {
        const response = await api.post('/api/users/register', credentials);
        const { user, token } = response.data;
        
        this.user = user;
        this.token = token;
        localStorage.setItem('token', token);
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
}); 