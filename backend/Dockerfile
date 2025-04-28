# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instalar TypeScript globalmente para garantir que tsc funcione
RUN npm install -g typescript

COPY . .

# Rodar a compilação TypeScript
RUN tsc

# Verificar o conteúdo da pasta dist para depuração
RUN ls -la dist/

EXPOSE 3000

CMD ["npm", "run", "start"]
