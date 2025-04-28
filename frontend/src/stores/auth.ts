import { defineStore } from 'pinia';
import axios from 'axios';

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
    token: localStorage.getItem('token')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(login: string, senha: string) {
      try {
        const response = await axios.post('/api/users/login', { login, senha });
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        localStorage.setItem('token', token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        throw error;
      }
    },

    async register(nome: string, login: string, senha: string) {
      try {
        const response = await axios.post('/api/users/register', {
          nome,
          login,
          senha
        });
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        localStorage.setItem('token', token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
}); 