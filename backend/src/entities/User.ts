import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  nome: string;

  @Column({ length: 100, unique: true })
  login: string;

  @Column({ length: 100 })
  senha: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  alterado_em: Date;

  @OneToMany(() => Recipe, recipe => recipe.usuario)
  receitas: Recipe[];
} 