import { DataSource } from 'typeorm';
import { Recipe } from './entities/Recipe';
import { User } from './entities/User';
import { Category } from './entities/Category';

export const createDataSource = () => {
  return new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Recipe, User, Category],
    synchronize: process.env.NODE_ENV === 'development',
    charset: 'utf8mb4'
  });
}; 