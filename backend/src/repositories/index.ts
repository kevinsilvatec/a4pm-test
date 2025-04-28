import { createDataSource } from '../data-source';
import { User } from '../entities/User';
import { Recipe } from '../entities/Recipe';
import { Category } from '../entities/Category';

export const initializeRepositories = async () => {
  const AppDataSource = createDataSource();
 
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return {
    userRepository: AppDataSource.getRepository(User),
    recipeRepository: AppDataSource.getRepository(Recipe),
    categoryRepository: AppDataSource.getRepository(Category)
  };
}; 