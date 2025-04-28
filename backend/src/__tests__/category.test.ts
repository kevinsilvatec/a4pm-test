import { Request, Response } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { Category } from '../entities/Category';
import { Repository } from 'typeorm';

describe('CategoryController', () => {
  let controller: CategoryController;
  let mockRepository: Partial<Repository<Category>>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    controller = new CategoryController(mockRepository as Repository<Category>);

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockRequest = {
      params: {},
      body: {},
    };
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = {
        nome: 'Test Category',
      };

      mockRequest.body = categoryData;

      const mockCategory = {
        id: 1,
        nome: categoryData.nome,
        receitas: [],
      };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockRepository.create as jest.Mock).mockReturnValue(mockCategory);
      (mockRepository.save as jest.Mock).mockResolvedValue(mockCategory);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { nome: categoryData.nome },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(categoryData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 400 if category name already exists', async () => {
      const categoryData = {
        nome: 'Existing Category',
      };

      mockRequest.body = categoryData;

      (mockRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        nome: categoryData.nome,
        receitas: [],
      });

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category with this name already exists',
      });
    });
  });

  describe('list', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 1, nome: 'Category 1', receitas: [] },
        { id: 2, nome: 'Category 2', receitas: [] },
      ];

      (mockRepository.find as jest.Mock).mockResolvedValue(categories);

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(categories);
    });
  });

  describe('getById', () => {
    it('should return a category when found', async () => {
      const category = {
        id: 1,
        nome: 'Test Category',
        receitas: [],
      };

      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(category);

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['receitas'],
      });
      expect(mockResponse.json).toHaveBeenCalledWith(category);
    });

    it('should return 404 when category is not found', async () => {
      mockRequest.params = { id: '999' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = 1;
      const updateData = {
        nome: 'Updated Category',
      };

      const existingCategory = {
        id: categoryId,
        nome: 'Old Category',
        receitas: [],
      };

      mockRequest.params = { id: categoryId.toString() };
      mockRequest.body = updateData;

      (mockRepository.findOne as jest.Mock)
        .mockResolvedValueOnce(existingCategory)
        .mockResolvedValueOnce(null);

      const updatedCategory = {
        ...existingCategory,
        ...updateData,
      };

      (mockRepository.merge as jest.Mock).mockReturnValue(updatedCategory);
      (mockRepository.save as jest.Mock).mockResolvedValue(updatedCategory);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingCategory, updateData);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedCategory);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return 404 if category not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { nome: 'Updated Category' };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should return 400 if updated name already exists', async () => {
      const existingCategory = {
        id: 1,
        nome: 'Old Category',
        receitas: [],
      };

      const duplicateCategory = {
        id: 2,
        nome: 'Updated Category',
        receitas: [],
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { nome: 'Updated Category' };

      (mockRepository.findOne as jest.Mock)
        .mockResolvedValueOnce(existingCategory)
        .mockResolvedValueOnce(duplicateCategory);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category with this name already exists',
      });
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const category = {
        id: 1,
        nome: 'Test Category',
        receitas: [],
      };

      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(category);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(category);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if category not found', async () => {
      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
}); 