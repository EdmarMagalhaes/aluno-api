
# 🎓 Aluno API + Frontend

Sistema completo de cadastro de alunos, com notas, status de aprovação e filtros inteligentes. Projeto fullstack com deploy em nuvem.

![Banner](https://raw.githubusercontent.com/EdmarMagalhaes/aluno-api/main/docs/banner.png)

---

## 🚀 Tecnologias utilizadas

### Backend
- Java 17 + Spring Boot
- Spring Data JPA + Hibernate
- PostgreSQL (Neon)
- Deploy: Render

### Frontend
- React + Vite
- TailwindCSS
- Axios
- Deploy: Render (Static Site)

---

## 🧪 Funcionalidades

- ✅ Cadastro, edição e exclusão de alunos
- ✅ Cálculo automático do status (`Aprovado` ou `Reprovado`)
- ✅ Filtros por nome, status e nota mínima
- ✅ Conexão com banco PostgreSQL em nuvem (Neon)
- ✅ Deploy fullstack (API + frontend)

---

## 📷 Imagens

### 🔍 Listagem de Alunos
![Listagem](https://raw.githubusercontent.com/EdmarMagalhaes/aluno-api/main/docs/listagem.png)

### 📝 Cadastro / Edição
![Formulario](https://raw.githubusercontent.com/EdmarMagalhaes/aluno-api/main/docs/formulario.png)

---

## 🧰 Como clonar e rodar o projeto localmente

```bash
# Clone o repositório
git clone https://github.com/EdmarMagalhaes/aluno-api.git

# Acesse a pasta do projeto
cd aluno-api

# Inicie o backend
cd backend
./mvnw spring-boot:run
```

```bash
# Em outro terminal, inicie o frontend
cd frontend
npm install
npm run dev
```

> Acesse o app em `http://localhost:5173`  
> A API estará disponível em `http://localhost:8080`

---

## 🌐 Acesso Online

- 🔗 API: https://aluno-api.onrender.com
- 🔗 Frontend: https://aluno-frontend.onrender.com

---

## 📁 Estrutura do Projeto

```
aluno-api/
├── backend/      # API REST com Spring Boot
├── frontend/     # Interface React com Vite
└── render.yaml   # Configuração de deploy Render
```

---

## 👨‍💻 Autor

**Edmar Magalhães**  
📧 edmarpmc@gmail.com  
📌 Projeto com fins educacionais e práticos

---

## 📄 Licença

Este projeto é livre para uso acadêmico, educacional e evoluções pessoais.  
Contribuições são bem-vindas! 🚀
