# Location404 - Aplicação Vue 3

Uma aplicação moderna de autenticação construída com Vue 3, Vite, TypeScript, Tailwind CSS, Vuex e Pinia.

## 🚀 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool rápido e moderno
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vuex** - Gerenciamento de estado centralizado
- **Pinia** - Store moderna para Vue
- **Vue Router** - Roteamento oficial do Vue

## 🎨 Design

### Paleta de Cores
- **Azul Escuro**: #0F5396 (contorno e sombra)
- **Azul Médio**: #1E6BB3 (parte mais escura)
- **Azul Claro**: #3B96E6 (parte mais clara)
- **Verde Escuro**: #2A5A30 (sombra e contorno)
- **Verde Médio**: #327137 (parte mais escura)
- **Verde Claro**: #51B059 (parte mais clara)
- **Branco**: #FFFFFF (reflexos)
- **Cinza Escuro**: #333333 (sombras internas)
- **Cinza Claro**: #CCCCCC (sombras suaves)

### Características do Design
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Moderno**: Interface limpa com gradientes e efeitos glassmorphism
- **Acessível**: Boa legibilidade e contraste
- **Interativo**: Animações suaves e feedback visual

## 📱 Funcionalidades

### Tela de Login
- Formulário de autenticação com email e senha
- Opção "Lembrar de mim"
- Link para recuperação de senha
- Validação de campos
- Loading state durante autenticação
- Redirecionamento automático após login

### Tela de Registro
- Formulário completo de cadastro
- Validação de força da senha em tempo real
- Confirmação de senha
- Checkbox para aceitar termos
- Validação de formulário completa
- Feedback visual para todos os campos

### Dashboard
- Página protegida por autenticação
- Exibição de informações do usuário
- Cards com estatísticas
- Botão de logout

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd location404
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código

## 📁 Estrutura do Projeto

```
location404/
├── public/
│   └── logo.png              # Ícone da aplicação
├── src/
│   ├── assets/
│   │   ├── main.css          # Estilos principais + Tailwind
│   │   └── base.css          # Estilos base
│   ├── components/
│   │   ├── LoginForm.vue     # Componente de login
│   │   └── RegisterForm.vue  # Componente de registro
│   ├── stores/
│   │   └── auth.ts           # Store Pinia para autenticação
│   ├── store/
│   │   └── index.ts          # Store Vuex para autenticação
│   ├── views/
│   │   ├── LoginView.vue     # Página de login
│   │   ├── RegisterView.vue  # Página de registro
│   │   └── DashboardView.vue # Página do dashboard
│   ├── router/
│   │   └── index.ts          # Configuração de rotas
│   ├── App.vue               # Componente raiz
│   └── main.ts               # Ponto de entrada
├── tailwind.config.js        # Configuração do Tailwind
├── postcss.config.js         # Configuração do PostCSS
└── vite.config.ts            # Configuração do Vite
```

## 🔐 Autenticação

A aplicação implementa um sistema de autenticação simulado com:

- **Vuex Store**: Gerenciamento de estado global
- **Pinia Store**: Alternativa moderna ao Vuex
- **Route Guards**: Proteção de rotas
- **Persistência**: Estado mantido durante a sessão

### Rotas Protegidas
- `/dashboard` - Requer autenticação
- `/login` e `/register` - Apenas para usuários não autenticados

## 🎯 Recursos Implementados

### ✅ Funcionalidades Principais
- [x] Configuração completa do Vue 3 + Vite + TypeScript
- [x] Integração do Tailwind CSS com cores customizadas
- [x] Configuração do Vuex e Pinia
- [x] Telas de login e registro responsivas
- [x] Validação de formulários
- [x] Indicador de força da senha
- [x] Sistema de roteamento com guards
- [x] Design moderno e responsivo
- [x] Integração do ícone personalizado

### 🎨 Design Features
- [x] Gradientes personalizados
- [x] Efeitos glassmorphism
- [x] Animações suaves
- [x] Responsividade completa
- [x] Estados de loading
- [x] Feedback visual

## 📱 Responsividade

A aplicação foi desenvolvida com mobile-first approach e funciona perfeitamente em:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: 320px - 767px

## 🚀 Próximos Passos

Para expandir a aplicação, considere implementar:

- [ ] Integração com API real de autenticação
- [ ] Recuperação de senha funcional
- [ ] Autenticação social (Google, Facebook)
- [ ] Temas claro/escuro
- [ ] Internacionalização (i18n)
- [ ] Testes unitários e e2e
- [ ] PWA (Progressive Web App)
- [ ] Notificações push

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

---

**Desenvolvido com ❤️ usando Vue 3 e Tailwind CSS**
