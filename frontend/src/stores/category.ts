import { defineStore } from 'pinia';
import api from '@/services/api';

interface Category {
  id: number;
  nome: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/api/categories');
        this.categories = response.data;
      } catch (error) {
        this.error = 'Failed to fetch categories';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(nome: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/api/categories', { nome });
        this.categories.push(response.data);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create category';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id: number, nome: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/api/categories/${id}`, { nome });
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = 'Failed to update category';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/api/categories/${id}`);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error) {
        this.error = 'Failed to delete category';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 