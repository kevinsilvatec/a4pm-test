import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Category } from './Category';

@Entity('receitas')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuarios' })
  id_usuarios: number;

  @Column({ name: 'id_categorias', nullable: true })
  id_categorias: number;

  @Column({ length: 45, nullable: true })
  nome: string;

  @Column({ name: 'tempo_preparo_minutos', nullable: true })
  tempo_preparo_minutos: number;

  @Column({ nullable: true })
  porcoes: number;

  @Column({ type: 'text' })
  modo_preparo: string;

  @Column({ type: 'text', nullable: true })
  ingredientes: string;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ name: 'alterado_em' })
  alterado_em: Date;

  @ManyToOne(() => User, user => user.receitas)
  @JoinColumn({ name: 'id_usuarios' })
  usuario: User;

  @ManyToOne(() => Category, category => category.receitas)
  @JoinColumn({ name: 'id_categorias' })
  categoria: Category;
} 