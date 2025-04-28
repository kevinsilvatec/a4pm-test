import { Router } from 'express';
import { body } from 'express-validator';
import { RecipeController } from '../controllers/RecipeController';
import { validateRequest } from '../middleware/validate.middleware';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/Recipe';

export const recipeRoutes = (repositories: { recipeRepository: Repository<Recipe> }) => {
  const router = Router();
  const recipeController = new RecipeController(repositories.recipeRepository);

  /**
   * @swagger
   * /api/recipes:
   *   post:
   *     summary: Create a new recipe
   *     tags: [Recipes]
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
   *               - modo_preparo
   *             properties:
   *               nome:
   *                 type: string
   *               id_categorias:
   *                 type: number
   *               tempo_preparo_minutos:
   *                 type: number
   *               porcoes:
   *                 type: number
   *               modo_preparo:
   *                 type: string
   *               ingredientes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Recipe created successfully
   *       400:
   *         description: Invalid input
   */
  router.post(
    '/',
    [
      body('nome').notEmpty().withMessage('Name is required'),
      body('modo_preparo').notEmpty().withMessage('Preparation method is required'),
      validateRequest
    ],
    recipeController.create.bind(recipeController)
  );

  /**
   * @swagger
   * /api/recipes:
   *   get:
   *     summary: Get all recipes
   *     tags: [Recipes]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of recipes
   */
  router.get('/', recipeController.list.bind(recipeController));

  /**
   * @swagger
   * /api/recipes/{id}:
   *   get:
   *     summary: Get a recipe by ID
   *     tags: [Recipes]
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
   *         description: Recipe details
   *       404:
   *         description: Recipe not found
   */
  router.get('/:id', recipeController.getById.bind(recipeController));

  /**
   * @swagger
   * /api/recipes/{id}:
   *   put:
   *     summary: Update a recipe
   *     tags: [Recipes]
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
   *             properties:
   *               nome:
   *                 type: string
   *               id_categorias:
   *                 type: number
   *               tempo_preparo_minutos:
   *                 type: number
   *               porcoes:
   *                 type: number
   *               modo_preparo:
   *                 type: string
   *               ingredientes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Recipe updated successfully
   *       404:
   *         description: Recipe not found
   */
  router.put(
    '/:id',
    [
      body('nome').optional(),
      body('modo_preparo').optional(),
      validateRequest
    ],
    recipeController.update.bind(recipeController)
  );

  /**
   * @swagger
   * /api/recipes/{id}:
   *   delete:
   *     summary: Delete a recipe
   *     tags: [Recipes]
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
   *         description: Recipe deleted successfully
   *       404:
   *         description: Recipe not found
   */
  router.delete('/:id', recipeController.delete.bind(recipeController));

  return router;
}; 