import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from '@/stores/recipe';
import axios from 'axios';

jest.mock('axios');

describe('Recipe Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have empty initial state', () => {
      const store = useRecipeStore();
      expect(store.recipes).toEqual([]);
      expect(store.currentRecipe).toBeNull();
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });
  });

  describe('fetchRecipes', () => {
    it('should fetch recipes successfully', async () => {
      const mockRecipes = [
        { id: 1, nome: 'Recipe 1' },
        { id: 2, nome: 'Recipe 2' },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockRecipes });

      const store = useRecipeStore();
      await store.fetchRecipes();

      expect(store.recipes).toEqual(mockRecipes);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const store = useRecipeStore();
      await expect(store.fetchRecipes()).rejects.toThrow('Fetch failed');

      expect(store.recipes).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to fetch recipes');
    });
  });

  describe('fetchRecipeById', () => {
    it('should fetch recipe by id successfully', async () => {
      const mockRecipe = { id: 1, nome: 'Recipe 1' };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockRecipe });

      const store = useRecipeStore();
      await store.fetchRecipeById(1);

      expect(store.currentRecipe).toEqual(mockRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const store = useRecipeStore();
      await expect(store.fetchRecipeById(1)).rejects.toThrow('Fetch failed');

      expect(store.currentRecipe).toBeNull();
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to fetch recipe');
    });
  });

  describe('createRecipe', () => {
    it('should create recipe successfully', async () => {
      const newRecipe = {
        nome: 'New Recipe',
        modo_preparo: 'Test preparation',
      };
      const savedRecipe = { id: 1, ...newRecipe };
      (axios.post as jest.Mock).mockResolvedValue({ data: savedRecipe });

      const store = useRecipeStore();
      const result = await store.createRecipe(newRecipe);

      expect(result).toEqual(savedRecipe);
      expect(store.recipes).toContainEqual(savedRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle create error', async () => {
      const newRecipe = {
        nome: 'New Recipe',
        modo_preparo: 'Test preparation',
      };
      (axios.post as jest.Mock).mockRejectedValue(new Error('Create failed'));

      const store = useRecipeStore();
      await expect(store.createRecipe(newRecipe)).rejects.toThrow('Create failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to create recipe');
    });
  });

  describe('updateRecipe', () => {
    it('should update recipe successfully', async () => {
      const updatedRecipe = {
        id: 1,
        nome: 'Updated Recipe',
      };
      (axios.put as jest.Mock).mockResolvedValue({ data: updatedRecipe });

      const store = useRecipeStore();
      store.recipes = [{ id: 1, nome: 'Old Recipe' }];
      const result = await store.updateRecipe(1, { nome: 'Updated Recipe' });

      expect(result).toEqual(updatedRecipe);
      expect(store.recipes[0]).toEqual(updatedRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle update error', async () => {
      (axios.put as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const store = useRecipeStore();
      await expect(store.updateRecipe(1, { nome: 'Updated Recipe' })).rejects.toThrow('Update failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to update recipe');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});

      const store = useRecipeStore();
      store.recipes = [{ id: 1, nome: 'Recipe to delete' }];
      await store.deleteRecipe(1);

      expect(store.recipes).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle delete error', async () => {
      (axios.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const store = useRecipeStore();
      store.recipes = [{ id: 1, nome: 'Recipe to delete' }];
      await expect(store.deleteRecipe(1)).rejects.toThrow('Delete failed');

      expect(store.recipes).toHaveLength(1);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to delete recipe');
    });
  });
}); 