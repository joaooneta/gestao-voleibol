## Aplicação Web para Gestão de Competições Esportivas Amadoras de Voleibol

A Aplicação Web para Gestão de Competições Esportivas Amadoras de Voleibol é um sistema para internet construído com o objetivo de agilizar os processos de inscrição, análise de documentos, e divulgação de resultados de competições esportivas amadoras de voleibol.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM

## Pacotes / Bibliotecas

- HeroUI
- Better Auth
- React Hook Form
- Zod

## Primeiros passos

- Pré-requisitos
  - Node.js (18+ recomendado)
  - npm (ou pnpm/yarn)
  - PostgreSQL

- Configuração de ambiente
  - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Chave secreta utilizada pelo Better Auth para assinatura de tokens e sessões
BETTER_AUTH_SECRET="sua-chave-secreta-aqui"

# URL base onde a aplicação está rodando (em desenvolvimento, geralmente http://localhost:3000)
BETTER_AUTH_URL="http://localhost:3000"

# String de conexão com o banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
```

- Instalação das dependências

```bash
npm install
```

- Configuração do banco de dados

```bash
npx prisma generate
npx prisma db push
```

- Para executar o projeto em desenvolvimento:

```bash
npm run dev
```

## Telas

- `/login`: Tela de Login

![Tela de Login](./public/screenshots/login.png)

- `/login`: Tela de Registro

![Tela de Registro](./public/screenshots/registro.png)

- `/teams`: Tela de Criação de Equipes

![Tela de Criação de Equipes](./public/screenshots/criar-equipe.png)

- `/teams[:id]`: Tela de Inserção de Jogadores na Equipe

![Tela de Inserção de Jogadores na Equipe](./public/screenshots/criar-jogadores.png)

- `/explore/tournaments`: Tela de Busca de Torneios Abertos para Inscrição

![Tela de Busca de Torneios Abertos para Inscrição](./public/screenshots/buscar-torneios.png)
![Tela de Busca de Torneios Abertos para Inscrição (modal)](./public/screenshots/modal-informacoes-torneio.png)

- `/tournaments`: Tela de Criação de Competições

![Tela de Criação de Competições](./public/screenshots/criar-torneio.png)

- `/tournaments[:id]`: Tela de Configuração da Competição

![Tela de Configuração de Competição](./public/screenshots/configurar-torneio.png)

- `/tournaments[:id]`: Tela de Gerenciamento de Inscrições da Competição

![Telas de Gerenciamento de Inscrições da Competição](./public/screenshots/gerenciar-inscricoes.png)

- `/tournaments[:id]`: Tela de Inserção dos Resultados das Partidas da Competição

![Tela de Inserção dos Resultados das Partidas da Competição](./public/screenshots/chaveamento-automatico.png)

- `/tournaments[:id]`: Tela de Divulgação do Resultado da Competição

![Tela de Divulgação do Resultado da Competição](./public/screenshots/resultado-torneio.png)

## Links

- Repository: https://github.com/joaooneta/gestao-voleibol

## Versionamento

1.0.0.0

## Autores

- **João Oneta**
