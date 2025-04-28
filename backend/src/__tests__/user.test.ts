import { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('UserController', () => {
  let controller: UserController;
  let mockRepository: Partial<Repository<User>>;
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

    controller = new UserController(mockRepository as Repository<User>);

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

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        nome: 'Test User',
        login: 'testuser',
        senha: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      const token = 'testToken';

      mockRequest.body = userData;

      const mockUser = {
        id: 1,
        ...userData,
        senha: hashedPassword,
        criado_em: new Date(),
        alterado_em: new Date(),
        receitas: [],
      };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockRepository.create as jest.Mock).mockReturnValue(mockUser);
      (mockRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await controller.register(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { login: userData.login },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.senha, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...userData,
        senha: hashedPassword,
        criado_em: expect.any(Date),
        alterado_em: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          nome: mockUser.nome,
          login: mockUser.login,
        },
        token,
      });
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        nome: 'Test User',
        login: 'existinguser',
        senha: 'password123',
      };

      mockRequest.body = userData;

      (mockRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        criado_em: new Date(),
        alterado_em: new Date(),
        receitas: [],
      });

      await controller.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const userData = {
        login: 'testuser',
        senha: 'password123',
      };

      const existingUser = {
        id: 1,
        nome: 'Test User',
        login: userData.login,
        senha: 'hashedPassword',
        criado_em: new Date(),
        alterado_em: new Date(),
        receitas: [],
      };

      const token = 'testToken';

      mockRequest.body = userData;

      (mockRepository.findOne as jest.Mock).mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { login: userData.login },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(userData.senha, existingUser.senha);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: existingUser.id },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: existingUser.id,
          nome: existingUser.nome,
          login: existingUser.login,
        },
        token,
      });
    });

    it('should return 401 if user not found', async () => {
      const userData = {
        login: 'nonexistent',
        senha: 'password123',
      };

      mockRequest.body = userData;

      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const userData = {
        login: 'testuser',
        senha: 'wrongpassword',
      };

      const existingUser = {
        id: 1,
        nome: 'Test User',
        login: userData.login,
        senha: 'hashedPassword',
        criado_em: new Date(),
        alterado_em: new Date(),
        receitas: [],
      };

      mockRequest.body = userData;

      (mockRepository.findOne as jest.Mock).mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });
  });
}); 