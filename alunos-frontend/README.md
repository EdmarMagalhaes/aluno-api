# Documentação do Frontend React para Sistema de Gerenciamento de Alunos

## Visão Geral

Este projeto é um frontend desenvolvido em React com TypeScript e TailwindCSS para consumir uma API REST de um Sistema de Gerenciamento de Alunos desenvolvido em Java com Spring Boot. O frontend implementa todas as funcionalidades necessárias para gerenciar alunos, incluindo:

- Listagem de alunos com filtros (nome, status, nota mínima)
- Cadastro de novos alunos
- Edição de alunos existentes
- Exclusão de alunos
- Visualização do status de aprovação/reprovação

## Estrutura do Projeto

```
alunos-frontend/
├── public/                  # Arquivos públicos
├── src/                     # Código fonte
│   ├── components/          # Componentes React
│   │   ├── AlunoForm.tsx    # Formulário para cadastro/edição
│   │   ├── AlunoList.tsx    # Lista de alunos com filtros
│   │   ├── DeleteConfirmation.tsx # Modal de confirmação de exclusão
│   │   └── Notification.tsx # Componente de notificações
│   ├── interfaces/          # Interfaces TypeScript
│   │   └── Aluno.ts         # Interfaces para Aluno e filtros
│   ├── services/            # Serviços de comunicação com API
│   │   ├── api.ts           # Configuração do axios
│   │   └── AlunoService.ts  # Métodos para comunicação com a API
│   ├── App.tsx              # Componente principal
│   ├── index.tsx            # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais com TailwindCSS
├── tailwind.config.js       # Configuração do TailwindCSS
├── tsconfig.json            # Configuração do TypeScript
└── package.json             # Dependências e scripts
```

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou pnpm (gerenciador de pacotes)
- Backend Java + Spring em execução

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   cd alunos-frontend
   pnpm install
   ```
3. Configure a URL da API no arquivo `src/services/api.ts`
4. Inicie o servidor de desenvolvimento:
   ```
   pnpm run dev
   ```

## Funcionalidades

### Listagem de Alunos

- Exibe todos os alunos cadastrados em formato de tabela
- Permite filtrar por nome, status (aprovado/reprovado) e nota mínima
- Exibe o status de aprovação com cores diferentes (verde para aprovado, vermelho para reprovado)

### Cadastro de Alunos

- Formulário para inserir nome e nota do aluno
- Validação de campos (nome obrigatório, nota entre 0 e 10)
- O status é calculado automaticamente pelo backend com base na nota (≥ 7.0 → Aprovado, < 7.0 → Reprovado)

### Edição de Alunos

- Permite alterar o nome e a nota de um aluno existente
- Utiliza o mesmo formulário de cadastro, preenchido com os dados atuais do aluno

### Exclusão de Alunos

- Solicita confirmação antes de excluir um aluno
- Exibe notificação de sucesso após a exclusão

## Comunicação com a API

O frontend se comunica com o backend através de requisições HTTP utilizando a biblioteca Axios. Os endpoints utilizados são:

- `GET /api/alunos` - Listar todos os alunos (com suporte a filtros via query params)
- `GET /api/alunos/{id}` - Buscar aluno por ID
- `POST /api/alunos` - Cadastrar novo aluno
- `PUT /api/alunos/{id}` - Atualizar aluno existente
- `DELETE /api/alunos/{id}` - Excluir aluno

## Configuração CORS no Backend

Para que o frontend possa se comunicar corretamente com o backend, é necessário configurar o CORS no lado do servidor Spring. Consulte o arquivo `cors-config.md` para instruções detalhadas sobre como implementar essa configuração.

## Personalização

### Alterando a URL da API

Para alterar a URL da API, edite o arquivo `src/services/api.ts` e modifique a propriedade `baseURL` para apontar para o endereço correto do seu backend.

### Personalizando o Tema

Este projeto utiliza TailwindCSS para estilização. Para personalizar cores, fontes e outros aspectos visuais, edite o arquivo `tailwind.config.js`.

## Considerações sobre Produção

Antes de implantar em produção:

1. Configure a URL correta da API para o ambiente de produção
2. No backend, configure o CORS para permitir apenas origens específicas
3. Execute o build de produção:
   ```
   pnpm run build
   ```
4. Implante os arquivos gerados na pasta `build/` em um servidor web
