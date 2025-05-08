# Gerenciador de Receitas

Um sistema completo de gerenciamento de receitas desenvolvido com Node.js, TypeScript, Vue.js e MySQL. Este aplicativo permite que os usuários criem, gerenciem e organizem suas receitas com categorias.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)

## 🌟 Funcionalidades

- Autenticação de usuários (registro/login)
- Gerenciamento de receitas (operações CRUD)
- Gerenciamento de categorias

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/get-started) e Docker Compose
- [Git](https://git-scm.com/)

## 🚀 Início Rápido

1. Clone o repositório:
```bash
git clone https://github.com/kevinsilvatec/a4pm-test
cd a4pm-test
```

2.1. Inicie a aplicação usando Docker Compose:
```bash
docker-compose up -d
```

Isso iniciará:
- Banco de dados MySQL (porta 3306)
- API Backend (porta 3000)

2.2. Inicie a aplicação usando Docker Compose:
```bash
cd frontend
npm ci
npm run dev
```

Isso iniciará:
- Frontend (porta 5173)

3. Acesse a aplicação:
- Frontend: http://localhost:5173
- Documentação da API: http://localhost:3000/api-docs

## 🏗️ Estrutura do Projeto

```
.
├── backend/           # API Node.js + TypeScript
├── frontend/         # Frontend Vue.js + TypeScript
├── db/              # Scripts do banco de dados
└── docker/          # Configuração do Docker
```

## 🔧 Configuração Manual (sem Docker)

### Configuração do Backend

1. Navegue até o diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env`:
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=db_receitas
JWT_SECRET=your_jwt_secret
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Configuração do Frontend

1. Navegue até o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🧪 Executando Testes

### Testes do Backend
```bash
cd backend
npm run test
```

### Testes do Frontend
```bash
cd frontend
npm run test
```

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI em:
```
http://localhost:3000/api-docs
```

## 🔐 Autenticação

A aplicação usa JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos:

1. Registre um novo usuário ou faça login
2. Use o token fornecido no cabeçalho Authorization:
```
Authorization: Bearer <seu-token>
```

## 🎨 Componentes da Interface

O frontend utiliza:
- Vue.js 3 com Composition API
- TailwindCSS para estilização
- Pinia para gerenciamento de estado
- Vue Router para navegação

## 📦 Scripts Disponíveis

### Backend
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila para produção
- `npm start`: Inicia o servidor de produção
- `npm run test`: Executa os testes
- `npm run migrate`: Executa as migrações do banco de dados

### Frontend
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila para produção
- `npm run preview`: Visualiza a compilação de produção
- `npm run test`: Executa os testes

## 🔄 Migrações do Banco de Dados

O esquema do banco de dados é criado automaticamente quando a aplicação inicia. As categorias iniciais também são inseridas através do arquivo `db/script.sql`.