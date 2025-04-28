import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

export class UserController {
  constructor(private userRepository: Repository<User>) {}

  async register(req: Request, res: Response) {
    try {
      const { nome, login, senha } = req.body;
      console.log(this.userRepository)
      const userExists = await this.userRepository.findOne({ where: { login } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const user = this.userRepository.create({
        nome,
        login,
        senha: hashedPassword,
        criado_em: new Date(),
        alterado_em: new Date()
      });

      await this.userRepository.save(user);

      const options: SignOptions = { expiresIn: '24h' };
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'default_secret',
        options
      );

      return res.status(201).json({
        user: {
          id: user.id,
          nome: user.nome,
          login: user.login
        },
        token
      });
    } catch (error) {
      console.error('Error in register:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      const user = await this.userRepository.findOne({ where: { login } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const options: SignOptions = { expiresIn: '24h' };
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'default_secret',
        options
      );

      return res.json({
        user: {
          id: user.id,
          nome: user.nome,
          login: user.login
        },
        token
      });
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 