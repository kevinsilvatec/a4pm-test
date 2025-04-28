import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/Recipe';

export class RecipeController {
  constructor(private recipeRepository: Repository<Recipe>) {}

  async create(req: Request, res: Response) {
    try {
      const {
        nome,
        id_categorias,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
      } = req.body;

      const recipe = this.recipeRepository.create({
        nome,
        id_usuarios: req.userId,
        id_categorias,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes,
        criado_em: new Date(),
        alterado_em: new Date()
      });

      await this.recipeRepository.save(recipe);

      return res.status(201).json(recipe);
    } catch (error) {
      console.error('Error in create recipe:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const recipes = await this.recipeRepository.find({
        where: { id_usuarios: req.userId },
        relations: ['categoria']
      });

      return res.json(recipes);
    } catch (error) {
      console.error('Error in list recipes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id);

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
      }

      const recipe = await this.recipeRepository.findOne({
        where: { id: recipeId, id_usuarios: req.userId },
        relations: ['categoria']
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.json(recipe);
    } catch (error) {
      console.error('Error in get recipe by id:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id);

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
      }

      const {
        nome,
        id_categorias,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
      } = req.body;

      const recipe = await this.recipeRepository.findOne({
        where: { id: recipeId, id_usuarios: req.userId }
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      this.recipeRepository.merge(recipe, {
        nome,
        id_categorias,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes,
        alterado_em: new Date()
      });

      const updatedRecipe = await this.recipeRepository.save(recipe);

      return res.json(updatedRecipe);
    } catch (error) {
      console.error('Error in update recipe:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipeId = parseInt(id);

      if (isNaN(recipeId)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
      }

      const recipe = await this.recipeRepository.findOne({
        where: { id: recipeId, id_usuarios: req.userId }
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      await this.recipeRepository.remove(recipe);

      return res.status(204).send();
    } catch (error) {
      console.error('Error in delete recipe:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 