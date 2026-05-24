# Gestão Financeira

Aplicação de gestão financeira desenvolvida para a disciplina de Programação para Dispositivos Móveis.

O projeto possui:

- Frontend em Expo/React Native Web.
- Backend em Node.js com Express.
- Banco de dados MySQL.
- Prisma ORM.
- Validação com Zod.
- Collection do Postman para teste dos endpoints.

## Funcionalidades implementadas

- Tela de login com validação de acesso.
- Mensagem de boas-vindas com o nome do usuário autenticado.
- Cadastro de receitas e despesas.
- Listagem de transações.
- Filtro por mês e ano na tela de transações.
- Filtro por mês e ano na tela de resumo.
- Gráfico de pizza na tela de resumo.
- Edição e exclusão de transações por toque longo/modal.
- Categorias padrão inseridas por seed.
- Cadastro de categorias customizadas pelo frontend.
- Integração do frontend com o backend.
- Persistência das transações e categorias em banco de dados.
- Rotas de categorias e transações no servidor.
- Validação de dados no backend com Zod.
- Collection do Postman versionada no projeto.

## Tecnologias utilizadas

### Frontend

- Expo
- React Native
- React Native Web
- Expo Router
- React Native Picker
- React Native Chart Kit
- React Native SVG

### Backend

- Node.js
- Express
- Prisma ORM
- MySQL
- Zod
- CORS
- Dotenv

## Estrutura do projeto

```txt
praticas/
├── gestao-financeira2/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── services/
│   ├── package.json
│   └── .env.example
│
└── gestao-financeira-api/
    ├── prisma/
    ├── src/
    ├── postman/
    │   └── collection.json
    ├── package.json
    └── .env.example
```

# Como rodar o projeto

Para rodar o projeto, é necessário iniciar primeiro o backend e depois o frontend.

## Pré-requisitos

Antes de começar, é necessário ter instalado:

- Node.js
- npm
- MySQL
- Expo/React Native funcionando no ambiente
- Postman, caso queira testar os endpoints

---

# 1. Rodando o backend

Entre na pasta da API:

```bash
cd praticas/gestao-financeira-api
```

Instale as dependências:

```bash
npm install
```

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE gestao_financeira
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Crie um arquivo chamado `.env` dentro da pasta `gestao-financeira-api`.

Use o arquivo `.env.example` como base.

Conteúdo esperado do `.env`:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

Substitua `SUA_SENHA` pela senha do MySQL da sua máquina.

Depois, rode a migration do Prisma:

```bash
npx prisma migrate dev --name init
```

Agora rode o seed para cadastrar as categorias padrão:

```bash
npm run prisma:seed
```

Inicie o backend:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Para testar se a API está funcionando, acesse no navegador ou no Postman:

```txt
GET http://localhost:3000/
```

Resposta esperada:

```json
{
  "ok": true,
  "name": "gestao-financeira-api"
}
```

---

# 2. Testando a API no Postman

A collection do Postman está em:

```txt
praticas/gestao-financeira-api/postman/collection.json
```

No Postman, importe essa collection.

Configure a variável:

```txt
baseUrl = http://localhost:3000
```

A collection possui testes para:

- Health-check.
- Listar categorias.
- Criar categoria.
- Atualizar categoria.
- Excluir categoria.
- Validar erro ao excluir categoria padrão.
- Criar transação.
- Listar transações.
- Excluir transação.
- Validar erro ao criar transação inválida.

---

# 3. Rodando o frontend

Com o backend ainda rodando, abra outro terminal.

Entre na pasta do frontend:

```bash
cd praticas/gestao-financeira2
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo chamado `.env` dentro da pasta `gestao-financeira2`.

Use o arquivo `.env.example` como base.

Conteúdo esperado do `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Inicie o frontend:

```bash
npm run start
```

Depois que o Expo iniciar, pressione:

```txt
w
```

para abrir o app na web.

---

# 4. Acesso ao app

Na tela de login, informe qualquer nome.

A senha padrão para acesso é:

```txt
123456
```

Exemplo:

```txt
Nome: Nathan
Senha: 123456
```

Depois do login, o app exibirá uma mensagem de boas-vindas com o nome informado.

---

# 5. Fluxo recomendado para testar

1. Inicie o backend com `npm run dev`.
2. Teste o health-check da API.
3. Inicie o frontend com `npm run start`.
4. Abra o app na web pressionando `w`.
5. Faça login com a senha `123456`.
6. Crie uma categoria customizada.
7. Cadastre uma transação usando essa categoria.
8. Veja a transação na aba de transações.
9. Use o filtro de mês e ano.
10. Segure uma transação para editar.
11. Segure uma transação para excluir.
12. Acesse a aba de resumo.
13. Confira saldo, receitas, despesas e gráfico de pizza.
14. Teste os endpoints no Postman usando a collection exportada.

---

# 6. Rotas principais da API

## Health-check

```txt
GET /
```

## Categorias

```txt
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

## Transações

```txt
GET /transactions
POST /transactions
PUT /transactions/:id
DELETE /transactions/:id
```

---

# 7. Observações importantes

- O backend precisa estar rodando para o frontend funcionar corretamente.
- O banco utilizado é MySQL.
- O arquivo `.env` não deve ser enviado para o GitHub.
- Os arquivos `.env.example` foram adicionados para mostrar como configurar o ambiente.
- A pasta `node_modules` não deve ser enviada para o GitHub.
- Para instalar as dependências, use `npm install` dentro de cada projeto.