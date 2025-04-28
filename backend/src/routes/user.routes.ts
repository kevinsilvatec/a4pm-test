import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware/validate.middleware';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

export const userRoutes = (repositories: { userRepository: Repository<User> }) => {
  const router = Router();
  const userController = new UserController(repositories.userRepository);

  /**
   * @swagger
   * /api/users/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *               - login
   *               - senha
   *             properties:
   *               nome:
   *                 type: string
   *               login:
   *                 type: string
   *               senha:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Invalid input
   */
  router.post(
    '/register',
    [
      body('nome').notEmpty().withMessage('Name is required'),
      body('login').notEmpty().withMessage('Login is required'),
      body('senha').notEmpty().withMessage('Password is required'),
      validateRequest
    ],
    userController.register.bind(userController)
  );

  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     summary: Login user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - login
   *               - senha
   *             properties:
   *               login:
   *                 type: string
   *               senha:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  router.post(
    '/login',
    [
      body('login').notEmpty().withMessage('Login is required'),
      body('senha').notEmpty().withMessage('Password is required'),
      validateRequest
    ],
    userController.login.bind(userController)
  );

  return router;
}; 