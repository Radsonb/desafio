# VenderGas - Sistema de Gestão Comercial

Sistema completo de gestão comercial desenvolvido com Node.js, Express, MongoDB, Next.js e TailwindCSS, aplicando metodologia Atomic Design.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **express-validator** para validações
- **CORS** configurado
- **Docker** para banco de dados

### Frontend  
- **Next.js 14** (App Router)
- **React** com Hooks
- **TailwindCSS** para estilização
- **Atomic Design** (atoms, molecules, organisms, templates)
- **Context API** para gerenciamento de estado
- **Responsive Design** (mobile-first)

## 📋 Pré-requisitos

- **Node.js** (versão 18+)
- **Docker** e **Docker Compose**
- **Git**

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio
```

### 2. Configure o Banco de Dados (MongoDB com Docker)

Crie o arquivo `docker-compose.yml` na **raiz do projeto**:

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: desafio-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: desafio
    volumes:
      - mongodb_data:/data/db

  mongo-express:
    image: mongo-express:1.0.2
    container_name: desafio-mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: admin123
      ME_CONFIG_MONGODB_URL: mongodb://admin:admin123@mongodb:27017/
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: pass
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

Inicie o banco de dados:
```bash
docker-compose up -d
```

### 3. Configure o Backend

Entre na pasta do backend:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Crie o arquivo `.env`:
```env
PORT=3001
MONGODB_URI=mongodb://admin:admin123@localhost:27017/desafio?authSource=admin
NODE_ENV=development
JWT_SECRET=VENDERGAS
JWT_EXPIRES_IN=7d
```

### 4. Configure o Frontend

Entre na pasta do frontend:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

## 🏃‍♂️ Como Executar

### 1. Inicie o Banco de Dados
```bash
docker-compose up -d
```

### 2. Inicie o Backend
```bash
cd backend
npm run dev
```
O backend estará disponível em: `http://localhost:3001`

### 3. Inicie o Frontend
```bash
cd frontend
npm run dev
```
O frontend estará disponível em: `http://localhost:3000`

## 🗂️ Estrutura do Projeto
