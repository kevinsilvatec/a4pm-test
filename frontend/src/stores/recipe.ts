import { defineStore } from 'pinia';
import api from '@/services/api';

interface Recipe {
  id: number;
  nome: string;
  id_usuarios: number;
  id_categorias: number | null;
  tempo_preparo_minutos: number | null;
  porcoes: number | null;
  modo_preparo: string;
  ingredientes: string | null;
  criado_em: string;
  alterado_em: string;
  categoria?: {
    id: number;
    nome: string;
  };
}

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

export const useRecipeStore = defineStore('recipe', {
  state: (): RecipeState => ({
    recipes: [],
    currentRecipe: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchRecipes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/api/recipes');
        this.recipes = response.data;
      } catch (error) {
        this.error = 'Failed to fetch recipes';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchRecipeById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/api/recipes/${id}`);
        this.currentRecipe = response.data;
      } catch (error) {
        this.error = 'Failed to fetch recipe';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createRecipe(recipe: Omit<Recipe, 'id' | 'criado_em' | 'alterado_em'>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/api/recipes', recipe);
        this.recipes.push(response.data);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create recipe';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateRecipe(id: number, recipe: Partial<Recipe>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/api/recipes/${id}`, recipe);
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
          this.recipes[index] = response.data;
        }
        if (this.currentRecipe?.id === id) {
          this.currentRecipe = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = 'Failed to update recipe';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRecipe(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/api/recipes/${id}`);
        this.recipes = this.recipes.filter(r => r.id !== id);
        if (this.currentRecipe?.id === id) {
          this.currentRecipe = null;
        }
      } catch (error) {
        this.error = 'Failed to delete recipe';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 