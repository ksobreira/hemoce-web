# Sangue Amigo / Hemoce Web

Sistema web de apoio à doação de sangue, com recursos para doadores e administradores. A aplicação permite consultar campanhas, realizar agendamentos, acompanhar solicitações, editar perfil e usar um assistente de doação integrado ao backend.

## Tecnologias Utilizadas

### Frontend
- React
- Vite
- React Router
- CSS Modules

### Backend
- Java 21
- Spring Boot 3
- Spring Security
- JWT
- BCrypt
- Spring Data JPA
- PostgreSQL

### Infraestrutura e Integrações
- Docker / Docker Compose para PostgreSQL
- Gemini API para o Assistente de Doação
- Maven Wrapper

## Funcionalidades

### Usuário comum
- Cadastro de usuário.
- Login com autenticação JWT.
- Home com resumo de campanhas e agendamentos.
- Listagem e detalhes de campanhas.
- Criação de agendamento.
- Listagem, detalhes e cancelamento de agendamentos.
- Perfil com visualização e edição de dados.
- Orientações para doação.
- Assistente IA para dúvidas gerais sobre doação de sangue.

### Administrador
- Login administrativo.
- Painel administrativo.
- Gerenciamento de campanhas.
- Criação, edição e exclusão de campanhas.
- Consulta de agendamentos por unidade e data.
- Atualização de status dos agendamentos.
- Perfil administrativo.
- Navegação separada da visão do usuário.

### Assistente IA
- Tela no frontend em `/assistente`.
- O frontend chama apenas o backend.
- O backend chama a Gemini API usando a variável de ambiente `GEMINI_API_KEY`.
- Endpoint principal: `POST /assistente-ia`.
- Endpoint de status: `GET /assistente-ia/status`.

## Estrutura do Projeto

```text
hemoce-web/
├── backend/              # API Spring Boot
├── frontend/             # Aplicação React + Vite
├── docker-compose.yml    # PostgreSQL local
└── README.md
```

## Como Rodar Localmente

### Pré-requisitos
- Java 21.
- Node.js.
- Docker e Docker Compose.
- Git.

### Subir o banco com Docker

Na raiz do projeto:

```bash
docker compose up -d
```

O `docker-compose.yml` sobe um PostgreSQL com:

- Banco: `sangueamigo`
- Usuário: `postgres`
- Senha: `postgres`
- Porta: `5432`

### Rodar o backend

Linux/macOS:

```bash
cd backend
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Por padrão, a API sobe em:

```text
http://localhost:8080
```

### Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o Vite sobe em:

```text
http://localhost:5173
```

### Build do frontend

```bash
cd frontend
npm run build
```

## Variáveis de Ambiente

### Gemini

A chave do Gemini deve ficar somente no ambiente local ou no ambiente de deploy. Nunca salve a chave no repositório.

PowerShell, temporário para a sessão atual:

```powershell
$env:GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

PowerShell, persistente no Windows:

```powershell
setx GEMINI_API_KEY "SUA_CHAVE_AQUI"
```

Também é possível ajustar o modelo:

```powershell
$env:GEMINI_MODEL="gemini-2.5-flash"
```

### Banco de dados

O backend lê as configurações padrão em `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sangueamigo
    username: postgres
    password: postgres
```

## Endpoints Principais

### Autenticação
- `POST /auth/cadastro-usuario`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/recuperar-senha`
- `POST /auth/redefinir-senha`

### Campanhas
- `GET /campanhas`
- `GET /campanhas/{id}`
- `GET /campanhas/admin`
- `POST /campanhas`
- `PUT /campanhas/{id}`
- `DELETE /campanhas/{id}`

### Agendamentos
- `POST /agendamentos`
- `GET /agendamentos`
- `GET /agendamentos/ativos`
- `PATCH /agendamentos/{id}/cancelar`
- `GET /agendamentos/admin?hemocentroId={id}&data={yyyy-mm-dd}`
- `PATCH /agendamentos/admin/{id}/status`

### Perfil
- `GET /usuarios/perfil`
- `PUT /usuarios/perfil`
- `GET /administradores/perfil`
- `PUT /administradores/perfil`

### Hemocentros e horários
- `GET /hemocentros`
- `GET /hemocentros/{id}`
- `GET /hemocentros/{id}/horarios?data={yyyy-mm-dd}`
- `GET /hemocentros/{id}/horarios-periodo?inicio={yyyy-mm-dd}&fim={yyyy-mm-dd}`
- `POST /hemocentros`
- `PUT /hemocentros/{id}`
- `DELETE /hemocentros/{id}`
- `POST /hemocentros/{id}/horarios`
- `PUT /hemocentros/{hemocentroId}/horarios/{id}`
- `DELETE /hemocentros/{hemocentroId}/horarios/{id}`

### Orientações
- `GET /orientacoes`

### Assistente IA
- `POST /assistente-ia`
- `GET /assistente-ia/status`

Exemplo de corpo para o assistente:

```json
{
  "pergunta": "Quem pode doar sangue?"
}
```

## Credenciais de Teste

### Administrador
- E-mail: `admin@sangueamigo.local`
- Senha: `Admin123!`

O administrador é criado automaticamente pelo backend quando o projeto sobe, usando as configurações `app.admin.*`.

### Usuário comum
- E-mail: `maria@email.com`
- Senha: `Senha123!`

Se o banco estiver limpo, cadastre o usuário comum pela tela de cadastro ou pelo endpoint `POST /auth/cadastro-usuario`.

## Observações Importantes

- Não commitar chaves, tokens ou segredos.
- A Gemini API deve ser chamada apenas pelo backend.
- O frontend nunca deve chamar a Gemini diretamente.
- A variável `GEMINI_API_KEY` precisa estar definida antes de iniciar o backend para que o assistente use IA real.
- Sem `GEMINI_API_KEY`, o backend mantém uma resposta local orientativa como fallback.
- Hemocentros e horários podem precisar ser cadastrados no banco ou pela API administrativa antes de testar agendamentos.

## Status do Projeto

Projeto em desenvolvimento acadêmico, com fluxo principal de autenticação, campanhas, agendamentos, perfil, orientações e assistente de doação já integrados.

## Equipe

- Kauan Sobreira
- Renato Romano
- Manoel Sergio
- Ricardo Santos
- Júlia Alvino

Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento Web.
