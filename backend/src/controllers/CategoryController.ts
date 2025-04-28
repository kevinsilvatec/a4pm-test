import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';

export class CategoryController {
  constructor(private categoryRepository: Repository<Category>) {}

  async create(req: Request, res: Response) {
    try {
      const { nome } = req.body;

      if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const categoryExists = await this.categoryRepository.findOne({ where: { nome } });
      if (categoryExists) {
        return res.status(400).json({ error: 'Category already exists' });
      }

      const category = this.categoryRepository.create({ nome });
      await this.categoryRepository.save(category);

      return res.status(201).json(category);
    } catch (error) {
      console.error('Error in create category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async list(_req: Request, res: Response) {
    try {
      const categories = await this.categoryRepository.find({
        order: { nome: 'ASC' }
      });

      return res.json(categories);
    } catch (error) {
      console.error('Error in list categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);

      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json(category);
    } catch (error) {
      console.error('Error in get category by id:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);

      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const { nome } = req.body;

      if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const categoryExists = await this.categoryRepository.findOne({ where: { nome } });
      if (categoryExists && categoryExists.id !== categoryId) {
        return res.status(400).json({ error: 'Category name already exists' });
      }

      this.categoryRepository.merge(category, { nome });
      const updatedCategory = await this.categoryRepository.save(category);

      return res.json(updatedCategory);
    } catch (error) {
      console.error('Error in update category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);

      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await this.categoryRepository.remove(category);

      return res.status(204).send();
    } catch (error) {
      console.error('Error in delete category:', error);
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'Cannot delete category that has recipes' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 