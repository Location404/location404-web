# Location404 Web - Sistema de Registro de Usuários

Este é um sistema web para registro e login de usuários, desenvolvido com Next.js, React e TypeScript.

## Funcionalidades

### ✅ Implementadas
- **Tela de registro de novos usuários** - formulário completo com validação
- **Serviço de registro** - API REST para cadastro de usuários
- **Tela de login** - interface para autenticação de usuários  
- **Serviço de login** - API REST para autenticação
- **Página inicial** - navegação entre registro e login
- **Validação de formulários** - validação client-side e server-side
- **Interface responsiva** - design adaptável para diferentes dispositivos
- **Feedback visual** - mensagens de erro e sucesso

### 📋 Campos do Registro
- Nome Completo (obrigatório)
- Email (obrigatório)
- Telefone (obrigatório)
- Endereço (opcional)
- Senha (obrigatório, mínimo 6 caracteres)
- Confirmação de Senha (obrigatório)

## Tecnologias Utilizadas

- **Next.js 15** - Framework React para aplicações web
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **CSS Modules** - Estilização modular e isolada

## Como Executar

### Desenvolvimento
```bash
npm install
npm run dev
```

A aplicação estará disponível em http://localhost:3000

### Produção
```bash
npm run build
npm run start
```

## Estrutura do Projeto

```
├── pages/
│   ├── api/
│   │   ├── registro.ts     # API de registro de usuários
│   │   └── login.ts        # API de login
│   ├── index.tsx           # Página inicial
│   ├── registro.tsx        # Tela de registro
│   ├── login.tsx           # Tela de login
│   ├── _app.tsx           # Configuração global do app
│   └── _document.tsx       # Configuração do documento HTML
├── styles/
│   ├── globals.css         # Estilos globais
│   ├── Home.module.css     # Estilos da página inicial
│   ├── Registro.module.css # Estilos da tela de registro
│   └── Login.module.css    # Estilos da tela de login
└── components/             # Componentes reutilizáveis (futuro)
```

## APIs Disponíveis

### POST /api/registro
Registra um novo usuário no sistema.

**Corpo da requisição:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "usuario": {
    "id": "abc123",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123",
    "dataCriacao": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/login
Autentica um usuário no sistema.

**Corpo da requisição:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "usuario": {
    "id": "abc123",
    "nome": "João Silva",
    "email": "joao@example.com"
  }
}
```

## Validações

### Frontend
- Validação de campos obrigatórios
- Validação de formato de email
- Validação de tamanho mínimo da senha
- Validação de confirmação de senha

### Backend
- Validação de dados de entrada
- Verificação de email duplicado
- Validação de formato de telefone
- Hash de senhas (simulado para demonstração)

## Notas Técnicas

- **Banco de dados**: Atualmente usa armazenamento em memória para demonstração. Em produção, deveria usar um banco de dados real.
- **Autenticação**: Sistema básico implementado. Em produção, deveria usar JWT ou sessões seguras.
- **Segurança**: Hash de senhas é simulado. Em produção, usar bcrypt ou similar.
- **Persistência**: Dados são perdidos ao reiniciar o servidor.

## Screenshots

### Página Inicial
![Homepage](https://github.com/user-attachments/assets/77c57cc3-e6fc-4049-9abc-56be93324101)

### Tela de Registro
![Registration Screen](https://github.com/user-attachments/assets/63bbd40b-656f-4c2d-abcd-b46c8358ce9b)

## Próximos Passos

- [ ] Integração com banco de dados real
- [ ] Sistema de autenticação com JWT
- [ ] Hash seguro de senhas
- [ ] Testes automatizados
- [ ] Recuperação de senha
- [ ] Perfil do usuário
- [ ] Validação de email por confirmação