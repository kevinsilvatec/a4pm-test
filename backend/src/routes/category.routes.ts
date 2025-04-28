import { Router } from 'express';
import { body } from 'express-validator';
import { CategoryController } from '../controllers/CategoryController';
import { validateRequest } from '../middleware/validate.middleware';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';

export const categoryRoutes = (repositories: { categoryRepository: Repository<Category> }) => {
  const router = Router();
  const categoryController = new CategoryController(repositories.categoryRepository);

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Get all categories
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of categories
   */
  router.get('/', categoryController.list.bind(categoryController));

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *             properties:
   *               nome:
   *                 type: string
   *     responses:
   *       201:
   *         description: Category created successfully
   *       400:
   *         description: Invalid input
   */
  router.post(
    '/',
    [
      body('nome').notEmpty().withMessage('Name is required'),
      validateRequest
    ],
    categoryController.create.bind(categoryController)
  );

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     summary: Get a category by ID
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category details
   *       404:
   *         description: Category not found
   */
  router.get('/:id', categoryController.getById.bind(categoryController));

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update a category
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *             properties:
   *               nome:
   *                 type: string
   *     responses:
   *       200:
   *         description: Category updated successfully
   *       404:
   *         description: Category not found
   */
  router.put(
    '/:id',
    [
      body('nome').notEmpty().withMessage('Name is required'),
      validateRequest
    ],
    categoryController.update.bind(categoryController)
  );

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category deleted successfully
   *       404:
   *         description: Category not found
   */
  router.delete('/:id', categoryController.delete.bind(categoryController));

  return router;
}; 