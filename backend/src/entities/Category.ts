import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true, nullable: true })
  nome: string;

  @OneToMany(() => Recipe, recipe => recipe.categoria)
  receitas: Recipe[];
} 