import { setActivePinia, createPinia } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import axios from 'axios';

jest.mock('axios');

describe('Category Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have empty initial state', () => {
      const store = useCategoryStore();
      expect(store.categories).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories = [
        { id: 1, nome: 'Category 1' },
        { id: 2, nome: 'Category 2' },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockCategories });

      const store = useCategoryStore();
      await store.fetchCategories();

      expect(store.categories).toEqual(mockCategories);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const store = useCategoryStore();
      await expect(store.fetchCategories()).rejects.toThrow('Fetch failed');

      expect(store.categories).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to fetch categories');
    });
  });

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      const newCategory = { id: 1, nome: 'New Category' };
      (axios.post as jest.Mock).mockResolvedValue({ data: newCategory });

      const store = useCategoryStore();
      const result = await store.createCategory('New Category');

      expect(result).toEqual(newCategory);
      expect(store.categories).toContainEqual(newCategory);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle create error', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('Create failed'));

      const store = useCategoryStore();
      await expect(store.createCategory('New Category')).rejects.toThrow('Create failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to create category');
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const updatedCategory = { id: 1, nome: 'Updated Category' };
      (axios.put as jest.Mock).mockResolvedValue({ data: updatedCategory });

      const store = useCategoryStore();
      store.categories = [{ id: 1, nome: 'Old Category' }];
      const result = await store.updateCategory(1, 'Updated Category');

      expect(result).toEqual(updatedCategory);
      expect(store.categories[0]).toEqual(updatedCategory);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle update error', async () => {
      (axios.put as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const store = useCategoryStore();
      await expect(store.updateCategory(1, 'Updated Category')).rejects.toThrow('Update failed');

      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to update category');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});

      const store = useCategoryStore();
      store.categories = [{ id: 1, nome: 'Category to delete' }];
      await store.deleteCategory(1);

      expect(store.categories).toEqual([]);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBeNull();
    });

    it('should handle delete error', async () => {
      (axios.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const store = useCategoryStore();
      store.categories = [{ id: 1, nome: 'Category to delete' }];
      await expect(store.deleteCategory(1)).rejects.toThrow('Delete failed');

      expect(store.categories).toHaveLength(1);
      expect(store.loading).toBeFalsy();
      expect(store.error).toBe('Failed to delete category');
    });
  });
}); 