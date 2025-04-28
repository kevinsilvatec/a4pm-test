import { Request, Response } from 'express';
import { RecipeController } from '../controllers/RecipeController';
import { Recipe } from '../entities/Recipe';
import { Repository } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

describe('RecipeController', () => {
  let controller: RecipeController;
  let mockRepository: Partial<Repository<Recipe>>;
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

    controller = new RecipeController(mockRepository as Repository<Recipe>);

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockRequest = {
      params: {},
      body: {},
      userId: 1,
    };
  });

  describe('create', () => {
    it('should create a new recipe', async () => {
      const recipeData = {
        nome: 'Test Recipe',
        id_categorias: 1,
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test preparation method',
        ingredientes: 'Test ingredients',
      };

      mockRequest.body = recipeData;

      const mockRecipe = {
        ...recipeData,
        id: 1,
        id_usuarios: mockRequest.userId,
        criado_em: expect.any(Date),
        alterado_em: expect.any(Date),
      };

      (mockRepository.create as jest.Mock).mockReturnValue(mockRecipe);
      (mockRepository.save as jest.Mock).mockResolvedValue(mockRecipe);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...recipeData,
        id_usuarios: mockRequest.userId,
        criado_em: expect.any(Date),
        alterado_em: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockRecipe);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipe);
    });
  });

  describe('list', () => {
    it('should return all recipes for the user', async () => {
      const recipes = [
        {
          id: 1,
          id_usuarios: mockRequest.userId,
          nome: 'Recipe 1',
          criado_em: new Date(),
          alterado_em: new Date(),
        },
        {
          id: 2,
          id_usuarios: mockRequest.userId,
          nome: 'Recipe 2',
          criado_em: new Date(),
          alterado_em: new Date(),
        },
      ];

      (mockRepository.find as jest.Mock).mockResolvedValue(recipes);

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id_usuarios: mockRequest.userId },
        relations: ['categoria'],
      });
      expect(mockResponse.json).toHaveBeenCalledWith(recipes);
    });
  });

  describe('getById', () => {
    it('should return a recipe when found', async () => {
      const mockRecipe = {
        id: 1,
        id_usuarios: mockRequest.userId,
        id_categorias: 1,
        nome: 'Test Recipe',
        tempo_preparo_minutos: 30,
        porcoes: 4,
        modo_preparo: 'Test preparation method',
        ingredientes: 'Test ingredients',
        criado_em: new Date(),
        alterado_em: new Date(),
      };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockRecipe);
      mockRequest.params = { id: '1' };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, id_usuarios: mockRequest.userId },
        relations: ['categoria'],
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockRecipe);
    });

    it('should return 404 when recipe is not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: '999' };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, id_usuarios: mockRequest.userId },
        relations: ['categoria'],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('update', () => {
    it('should update an existing recipe', async () => {
      const existingRecipe = {
        id: 1,
        id_usuarios: mockRequest.userId,
        nome: 'Old Recipe',
        modo_preparo: 'Old method',
        criado_em: new Date(),
        alterado_em: new Date(),
      };

      const recipeData = {
        nome: 'Updated Recipe',
        modo_preparo: 'Updated method',
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = recipeData;

      const mergedRecipe = {
        ...existingRecipe,
        ...recipeData,
        alterado_em: new Date(),
      };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(existingRecipe);
      (mockRepository.merge as jest.Mock).mockReturnValue(mergedRecipe);
      (mockRepository.save as jest.Mock).mockResolvedValue(mergedRecipe);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, id_usuarios: mockRequest.userId },
      });

      expect(mockRepository.merge).toHaveBeenCalledWith(existingRecipe, {
        ...recipeData,
        alterado_em: expect.any(Date),
      });

      expect(mockRepository.save).toHaveBeenCalledWith(mergedRecipe);
      expect(mockResponse.json).toHaveBeenCalledWith(mergedRecipe);
    });

    it('should return 404 if recipe not found', async () => {
      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('delete', () => {
    it('should delete an existing recipe', async () => {
      const recipe = {
        id: 1,
        id_usuarios: mockRequest.userId,
        nome: 'Test Recipe',
        criado_em: new Date(),
        alterado_em: new Date(),
      };

      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(recipe);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, id_usuarios: mockRequest.userId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(recipe);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if recipe not found', async () => {
      mockRequest.params = { id: '1' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });
}); 