import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from '@/stores/recipe';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
        {
          id: 1,
          nome: 'Recipe 1',
          id_usuarios: 1,
          id_categorias: 1,
          tempo_preparo_minutos: 30,
          porcoes: 4,
          modo_preparo: 'Test method',
          ingredientes: 'Test ingredients',
          criado_em: new Date().toISOString(),
          alterado_em: new Date().toISOString()
        },
        {
          id: 2,
          nome: 'Recipe 2',
          id_usuarios: 1,
          id_categorias: 1,
          tempo_preparo_minutos: 30,
          porcoes: 4,
          modo_preparo: 'Test method',
          ingredientes: 'Test ingredients',
          criado_em: new Date().toISOString(),
          alterado_em: new Date().toISOString()
        }
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipes });

      const store = useRecipeStore();
      await store.fetchRecipes();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/recipes');
      expect(store.recipes).toEqual(mockRecipes);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Fetch failed'));

      const store = useRecipeStore();
      await expect(store.fetchRecipes()).rejects.toThrow('Fetch failed');

      expect(store.recipes).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to fetch recipes');
    });
  });

  describe('fetchRecipeById', () => {
    it('should fetch recipe by id successfully', async () => {
      const mockRecipe = {
        id: 1,
        nome: 'Recipe 1',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipe });

      const store = useRecipeStore();
      await store.fetchRecipeById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/recipes/1');
      expect(store.currentRecipe).toEqual(mockRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Fetch failed'));

      const store = useRecipeStore();
      await expect(store.fetchRecipeById(1)).rejects.toThrow('Fetch failed');

      expect(store.currentRecipe).toBeNull();
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to fetch recipe');
    });
  });

  describe('createRecipe', () => {
    it('should create a new recipe', async () => {
      const newRecipe = {
        nome: 'Test Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test preparation method',
        ingredientes: 'Test ingredients'
      };

      const mockResponse = {
        data: {
          id: 1,
          ...newRecipe,
          criado_em: new Date().toISOString(),
          alterado_em: new Date().toISOString()
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const store = useRecipeStore();
      const result = await store.createRecipe(newRecipe);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/recipes', newRecipe);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle create error', async () => {
      const newRecipe = {
        nome: 'Test Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test preparation method',
        ingredientes: 'Test ingredients'
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Create failed'));

      const store = useRecipeStore();
      await expect(store.createRecipe(newRecipe)).rejects.toThrow('Create failed');
    });
  });

  describe('updateRecipe', () => {
    it('should update an existing recipe', async () => {
      const store = useRecipeStore();
      const existingRecipe = {
        id: 1,
        nome: 'Old Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Old method',
        ingredientes: 'Old ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      store.recipes = [existingRecipe];

      const updatedRecipe = {
        nome: 'Updated Recipe',
        modo_preparo: 'Updated method'
      };

      const mockResponse = {
        data: {
          ...existingRecipe,
          ...updatedRecipe,
          alterado_em: new Date().toISOString()
        }
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await store.updateRecipe(1, updatedRecipe);

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/recipes/1', updatedRecipe);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle update error', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));

      const store = useRecipeStore();
      await expect(store.updateRecipe(1, { nome: 'Updated Recipe' })).rejects.toThrow('Update failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to update recipe');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete an existing recipe', async () => {
      const store = useRecipeStore();
      const recipeToDelete = {
        id: 1,
        nome: 'Recipe to delete',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      store.recipes = [recipeToDelete];

      mockedAxios.delete.mockResolvedValueOnce({});

      await store.deleteRecipe(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/recipes/1');
      expect(store.recipes).toHaveLength(0);
    });

    it('should handle delete error', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Delete failed'));

      const store = useRecipeStore();
      const recipeToDelete = {
        id: 1,
        nome: 'Recipe to delete',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      store.recipes = [recipeToDelete];
      
      await expect(store.deleteRecipe(1)).rejects.toThrow('Delete failed');

      expect(store.recipes).toHaveLength(1);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to delete recipe');
    });
  });
}); 