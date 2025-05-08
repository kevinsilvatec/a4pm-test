import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from '@/stores/recipe';
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

describe('Recipe Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have empty initial state', () => {
      const store = useRecipeStore();
      expect(store.recipes).toEqual([]);
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
      mockedApi.get.mockResolvedValueOnce({ data: mockRecipes });

      const store = useRecipeStore();
      await store.fetchRecipes();

      expect(store.recipes).toEqual(mockRecipes);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Fetch failed'));

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
      mockedApi.get.mockResolvedValueOnce({ data: mockRecipe });

      const store = useRecipeStore();
      await store.fetchRecipeById(1);

      expect(mockedApi.get).toHaveBeenCalledWith('/api/recipes/1');
      expect(store.currentRecipe).toEqual(mockRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Fetch failed'));

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
        id: 1,
        nome: 'New Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      mockedApi.post.mockResolvedValueOnce({ data: newRecipe });

      const store = useRecipeStore();
      const result = await store.createRecipe({
        nome: 'New Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients'
      });

      expect(result).toEqual(newRecipe);
      expect(store.recipes).toContainEqual(newRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle create error', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Create failed'));

      const store = useRecipeStore();
      await expect(store.createRecipe({
        nome: 'New Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test method',
        ingredientes: 'Test ingredients'
      })).rejects.toThrow('Create failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to create recipe');
    });
  });

  describe('updateRecipe', () => {
    it('should update recipe successfully', async () => {
      const updatedRecipe = {
        id: 1,
        nome: 'Updated Recipe',
        id_usuarios: 1,
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Updated method',
        ingredientes: 'Updated ingredients',
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString()
      };
      mockedApi.put.mockResolvedValueOnce({ data: updatedRecipe });

      const store = useRecipeStore();
      store.recipes = [{
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
      }];
      const result = await store.updateRecipe(1, {
        nome: 'Updated Recipe',
        modo_preparo: 'Updated method',
        ingredientes: 'Updated ingredients'
      });

      expect(result).toEqual(updatedRecipe);
      expect(store.recipes[0]).toEqual(updatedRecipe);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle update error', async () => {
      mockedApi.put.mockRejectedValueOnce(new Error('Update failed'));

      const store = useRecipeStore();
      await expect(store.updateRecipe(1, {
        nome: 'Updated Recipe',
        modo_preparo: 'Updated method'
      })).rejects.toThrow('Update failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to update recipe');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      mockedApi.delete.mockResolvedValueOnce({});

      const store = useRecipeStore();
      store.recipes = [{
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
      }];
      await store.deleteRecipe(1);

      expect(store.recipes).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle delete error', async () => {
      mockedApi.delete.mockRejectedValueOnce(new Error('Delete failed'));

      const store = useRecipeStore();
      store.recipes = [{
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
      }];
      await expect(store.deleteRecipe(1)).rejects.toThrow('Delete failed');

      expect(store.recipes).toHaveLength(1);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to delete recipe');
    });
  });
}); 