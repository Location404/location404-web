# 🌍 Location404 Web Client

Cliente web multiplayer para o Location404 - interface interativa em Vue 3 + TypeScript para jogo de adivinhação geográfica competitivo em tempo real com Google Street View.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?logo=vue.js&logoColor=black)](https://pinia.vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura Frontend](#-arquitetura-frontend)
  - [Estrutura de Pastas](#estrutura-de-pastas)
  - [Padrões Arquiteturais](#padrões-arquiteturais)
  - [Dependency Injection](#dependency-injection)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Google Maps API](#google-maps-api)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Componentes Principais](#-componentes-principais)
  - [PlayForm](#playform)
  - [StreetViewPanorama](#streetviewpanorama)
  - [GuessMap](#guessmap)
  - [MatchResult](#matchresult)
- [Composables](#-composables)
  - [useGameEngine](#usegameengine)
  - [useGeoData](#usegeodata)
  - [useFormValidation](#useformvalidation)
- [State Management](#-state-management)
  - [Auth Store](#auth-store)
- [Integração com Backend](#-integração-com-backend)
  - [SignalR (Game Engine)](#signalr-game-engine)
  - [REST APIs](#rest-apis)
- [Rotas](#-rotas)
- [Testes](#-testes)
- [Build e Deploy](#-build-e-deploy)
- [Convenções de Código](#-convenções-de-código)
- [Desenvolvedor](#-desenvolvedor)

---

## 🎯 Visão Geral

O **Location404 Web Client** é a interface do usuário para o jogo multiplayer de adivinhação geográfica. Construído com **Vue 3 Composition API**, **TypeScript** e **Vite**, oferece uma experiência de jogo fluida e responsiva com comunicação em tempo real via **SignalR**.

### Funcionalidades Principais

- 🎮 **Matchmaking em Tempo Real**: Fila de espera automática para encontrar oponentes
- 🗺️ **Google Street View Integration**: Explore locações reais ao redor do mundo
- 🎯 **Sistema de Palpites Interativo**: Clique no mapa para marcar sua resposta
- 📊 **Estatísticas e Ranking**: Acompanhe seu desempenho e ranking global
- 🔐 **Autenticação JWT**: Login seguro com tokens HttpOnly cookies
- ⚡ **Real-time Updates**: SignalR para eventos de partida, rounds e resultados
- 🎨 **UI Responsiva**: TailwindCSS com design moderno e animações

---

## 🏗️ Arquitetura Frontend

### Estrutura de Pastas

```
src/
├── assets/              # Imagens, ícones, estilos globais
├── components/          # Componentes Vue reutilizáveis
│   ├── PlayForm.vue
│   ├── StreetViewPanorama.vue
│   ├── GuessMap.vue
│   ├── MatchResult.vue
│   ├── RoundResult.vue
│   ├── LoginForm.vue
│   ├── RegisterForm.vue
│   ├── ConfigForm.vue
│   └── ToolbarForm.vue
├── composables/         # Lógica reativa compartilhada (Composition API)
│   ├── useGameEngine.ts
│   ├── useGeoData.ts
│   ├── useFormValidation.ts
│   ├── useErrorHandler.ts
│   ├── useService.ts
│   └── useToast.ts
├── config/              # Configurações e constantes
│   ├── constants.ts
│   ├── axios.config.ts
│   └── runtime.config.ts
├── core/                # Dependency Injection Container
│   ├── container.ts
│   └── service-registration.ts
├── router/              # Vue Router (navegação)
│   └── index.ts
├── services/            # Serviços de comunicação com APIs
│   ├── gameEngineService.ts     # SignalR (WebSocket)
│   ├── geoDataService.ts        # REST API (locations, matches, stats)
│   ├── userIdentityService.ts   # REST API (auth, profile)
│   └── googleMapsLoader.ts      # Carregamento dinâmico do SDK
├── stores/              # Pinia Stores (state management)
│   └── auth.ts
├── types/               # TypeScript interfaces/types
│   ├── auth.types.ts
│   ├── game.types.ts
│   ├── user.types.ts
│   ├── service.types.ts
│   └── google-maps.d.ts
├── utils/               # Utilitários (error handling, image utils)
│   ├── error-handler.ts
│   └── image-utils.ts
├── views/               # Páginas da aplicação
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── PlayView.vue
│   ├── RankingView.vue
│   ├── PlayerStatsView.vue
│   └── ConfigView.vue
├── App.vue              # Componente raiz
└── main.ts              # Entry point (bootstrap)
```

### Padrões Arquiteturais

**1. Composition API com `<script setup>`**

Todos os componentes e composables usam a Composition API para melhor reuso de lógica e type safety:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameEngine } from '@/composables'

const { state, joinMatchmaking, submitGuess } = useGameEngine()
const isSearching = computed(() => state.value.matchmakingStatus === 'SEARCHING')
</script>
```

**2. Dependency Injection Container**

Gerenciamento centralizado de serviços singleton (SignalR, HTTP clients):

```
┌───────────────────────────────────────────────────────────────┐
│                    Application Bootstrap                      │
│                       (main.ts)                               │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│              Service Registration (DI Container)              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐   │
│  │ UserIdentityService │  │ GameEngineService (SignalR)  │   │
│  │   (Singleton)       │  │      (Singleton)             │   │
│  └─────────────────────┘  └──────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    Composables Layer                          │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ useService() │  │ useAuth()  │  │ useGameEngine()      │  │
│  │ (Inject DI)  │  │ (Pinia)    │  │ (SignalR Events)     │  │
│  └──────────────┘  └────────────┘  └──────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    Components Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  PlayForm    │  │  GuessMap    │  │  MatchResult     │    │
│  │  (Game UI)   │  │  (Maps API)  │  │  (Results UI)    │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

**3. State Management com Pinia**

Store persistente para autenticação com `pinia-plugin-persistedstate`:

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const userStore = ref<UserStore | null>(null)
  const isAuthenticated = computed(() => !!userStore.value)

  async function login(user: UserStore) {
    userStore.value = user
  }

  return { userStore, isAuthenticated, login, logout }
}, {
  persist: true // Auto-persiste no localStorage
})
```

### Dependency Injection

O container DI personalizado gerencia singletons de serviços:

```typescript
// core/container.ts
class Container {
  registerSingleton<T>(identifier: symbol, factory: Factory<T>): void
  resolve<T>(identifier: symbol): T
}

// core/service-registration.ts
export const registerServices = (): void => {
  container.registerSingleton(
    SERVICE_TOKENS.GAME_ENGINE,
    () => new GameEngineService()
  )
}

// composables/useService.ts
export const useGameEngineService = (): GameEngineService => {
  return inject(SERVICE_TOKENS.GAME_ENGINE)
}
```

---

## 🛠️ Tecnologias

### Core Framework
- **Vue 3.5** - Framework progressivo com Composition API
- **TypeScript 5.8** - Tipagem estática e inferência de tipos
- **Vite 7.0** - Build tool ultra-rápido com HMR

### UI/UX
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Vue Sonner** - Toast notifications elegantes
- **Google Maps API** - Street View e mapas interativos

### State & Routing
- **Pinia 3.0** - State management oficial do Vue
- **Vue Router 4.5** - Roteamento com guards de autenticação
- **Pinia Persisted State** - Persistência automática no localStorage

### Comunicação com Backend
- **@microsoft/signalr 9.0** - Cliente WebSocket para tempo real
- **Axios 1.12** - Cliente HTTP com interceptors
- **Universal Cookie** - Gerenciamento de cookies (tokens JWT)

### Testes
- **Vitest 4.0** - Test runner compatível com Vite
- **@vue/test-utils 2.4** - Utilitários para testar componentes Vue
- **happy-dom** - DOM implementation para testes
- **@vitest/coverage-v8** - Relatórios de cobertura

### Qualidade de Código
- **ESLint 9** - Linter JavaScript/TypeScript
- **Prettier 3.6** - Formatador de código
- **@vue/eslint-config-typescript** - Regras específicas para Vue + TS

---

## 📦 Pré-requisitos

- **Node.js**: `^20.19.0` ou `>=22.12.0`
- **npm**: `>=10.x` ou **pnpm**: `>=9.x`
- **Google Maps API Key** (obrigatório para Street View)

### Serviços Backend Necessários

A aplicação depende de 3 microserviços rodando:

| Serviço             | URL (Desenvolvimento)      | Descrição                              |
|---------------------|----------------------------|----------------------------------------|
| **location404-auth** | `http://localhost:5185`   | Autenticação e perfil de usuário       |
| **location404-game** | `http://localhost:5170`   | SignalR game engine (tempo real)       |
| **location404-data** | `http://localhost:5000`   | Locations, estatísticas, ranking       |

---

## 🚀 Instalação

```bash
# Clone o repositório (se ainda não clonou)
git clone https://github.com/seu-usuario/location404.git
cd location404/location404-web

# Instale as dependências
npm install

# Ou usando pnpm
pnpm install
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Backend Services URLs
VITE_AUTH_API=http://localhost:5185
VITE_GAME_API=http://localhost:5170
VITE_DATA_API=http://localhost:5000

# Google Maps API Key (obrigatório)
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

# Opcional: Log level
VITE_LOG_LEVEL=debug
```

#### Obter Google Maps API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative **Maps JavaScript API** e **Street View Static API**
4. Em **Credenciais**, crie uma **API Key**
5. Adicione restrições (opcional):
   - **Referenciadores HTTP**: `http://localhost:5173/*`, `https://seu-dominio.com/*`
   - **APIs restritas**: Maps JavaScript API, Street View Static API

⚠️ **Importante**: Nunca commite o `.env` com chaves reais. Use `.env.example` como template.

### Google Maps API

O projeto carrega o SDK do Google Maps dinamicamente via `googleMapsLoader.ts`:

```typescript
// src/services/googleMapsLoader.ts
export const loadGoogleMapsApi = async (): Promise<void> => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Carrega script com Street View
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
  document.head.appendChild(script)
}
```

---

## ▶️ Executando a Aplicação

### Desenvolvimento

```bash
# Inicia o dev server com Hot Module Replacement
npm run dev

# Servidor será iniciado em http://localhost:5173
# Acessível também via rede local (--host flag configurada)
```

### Build de Produção

```bash
# Type-check + build otimizado
npm run build

# Preview do build de produção
npm run preview
```

### Type Checking

```bash
# Verifica erros de TypeScript
npm run type-check
```

### Linting e Formatação

```bash
# Executa ESLint com auto-fix
npm run lint

# Formata código com Prettier
npm run format
```

---

## 🧩 Componentes Principais

### PlayForm

**Arquivo**: `src/components/PlayForm.vue`

Componente principal do jogo que orquestra matchmaking, rounds e submissão de palpites.

**Responsabilidades**:
- Gerencia estado do jogo via `useGameEngine()`
- Renderiza Street View e Guess Map
- Controla timer de round (90 segundos)
- Exibe resultados de rounds e partidas

**Fluxo de Jogo**:
```
1. Usuário clica "Jogar" → joinMatchmaking()
2. Backend encontra oponente → evento MatchFound
3. Round inicia → evento RoundStarted (recebe location)
4. Usuário explora Street View e marca palpite no mapa
5. submitGuess() → envia coordenadas ao backend
6. Aguarda palpite do oponente
7. Evento RoundEnded → exibe distâncias e pontos
8. Repete passos 3-7 por 3 rounds
9. Evento MatchEnded → exibe resultado final
```

**Props/Emits**: Nenhum (usa composables)

**Exemplo de Uso**:
```vue
<template>
  <PlayView>
    <PlayForm />
  </PlayView>
</template>
```

---

### StreetViewPanorama

**Arquivo**: `src/components/StreetViewPanorama.vue`

Renderiza Google Street View com controles interativos.

**Props**:
```typescript
interface Props {
  location: Coordinate  // { x: latitude, y: longitude }
  heading?: number      // Direção inicial (0-360°)
  pitch?: number        // Inclinação vertical (-90 a +90°)
}
```

**Features**:
- Inicialização lazy do Google Maps SDK
- Controles de navegação (setas, zoom)
- Restrição de movimentação ao redor da location
- Adaptação responsiva ao tamanho do container

**Exemplo de Uso**:
```vue
<template>
  <StreetViewPanorama
    :location="{ x: 48.8566, y: 2.3522 }"
    :heading="90"
    :pitch="0"
  />
</template>
```

---

### GuessMap

**Arquivo**: `src/components/GuessMap.vue`

Mapa interativo do Google Maps para marcação de palpites.

**Props**:
```typescript
interface Props {
  disabled?: boolean  // Desabilita cliques (após submissão)
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'guessMarked', coords: Coordinate): void
}
```

**Features**:
- Marcador vermelho no local do clique
- Centralização automática em palpites
- Modo desabilitado após submissão
- Zoom ajustável

**Exemplo de Uso**:
```vue
<template>
  <GuessMap
    :disabled="guessSubmitted"
    @guessMarked="handleGuess"
  />
</template>

<script setup lang="ts">
const handleGuess = (coords: Coordinate) => {
  console.log(`Palpite: ${coords.x}, ${coords.y}`)
}
</script>
```

---

### MatchResult

**Arquivo**: `src/components/MatchResult.vue`

Exibe resultado final da partida (vitória/derrota/empate).

**Props**:
```typescript
interface Props {
  matchData: GameMatch  // Inclui players, rounds, scores
}
```

**Features**:
- Animações de vitória/derrota
- Tabela de pontuação por round
- Distâncias acumuladas
- Pontos ELO ganhos/perdidos
- Botão para nova partida

**Exemplo de Uso**:
```vue
<template>
  <MatchResult :matchData="currentMatch" />
</template>
```

---

## 🎣 Composables

### useGameEngine

**Arquivo**: `src/composables/useGameEngine.ts`

Composable principal que gerencia comunicação SignalR e estado do jogo.

**API Pública**:
```typescript
const {
  state,              // GameState reativo
  isConnected,        // boolean
  isSearching,        // computed
  inMatch,            // computed
  currentRoundNumber, // computed

  // Métodos
  connect,            // () => Promise<void>
  disconnect,         // () => Promise<void>
  joinMatchmaking,    // () => Promise<void>
  leaveMatchmaking,   // () => Promise<void>
  submitGuess,        // (coordinate: Coordinate) => Promise<void>

  // Eventos SignalR
  onMatchFound,       // (callback) => void
  onRoundStarted,     // (callback) => void
  onRoundEnded,       // (callback) => void
  onMatchEnded,       // (callback) => void
} = useGameEngine()
```

**Fluxo de Eventos**:
```
connect() → estabelece WebSocket
  │
  ├─ onMatchFound → atualiza state.currentMatch
  ├─ onRoundStarted → atualiza state.currentRound, currentLocation
  ├─ onRoundEnded → exibe resultados do round
  └─ onMatchEnded → exibe resultado final
```

**Gerenciamento de Estado**:
```typescript
interface GameState {
  matchmakingStatus: MatchmakingStatus
  gameStatus: GameStatus
  currentMatch: GameMatch | null
  currentRound: GameRound | null
  currentLocation: Location | null
  myGuess: Coordinate | null
  opponentGuess: Coordinate | null
  isMyTurn: boolean
}
```

---

### useGeoData

**Arquivo**: `src/composables/useGeoData.ts`

Gerencia requisições à API de dados (locations, stats, ranking).

**API Pública**:
```typescript
const {
  fetchRandomLocation,  // () => Promise<Location>
  fetchPlayerStats,     // (playerId: string) => Promise<PlayerStats>
  fetchRanking,         // (limit?: number) => Promise<PlayerStats[]>
} = useGeoData()
```

**Exemplo de Uso**:
```typescript
const stats = await fetchPlayerStats(authStore.userStore.userId)
console.log(`Vitórias: ${stats.wins}, Pontos: ${stats.rankingPoints}`)
```

---

### useFormValidation

**Arquivo**: `src/composables/useFormValidation.ts`

Validação de formulários de login/registro.

**API Pública**:
```typescript
const {
  validateEmail,    // (email: string) => boolean
  validatePassword, // (password: string) => string | null
  validateUsername, // (username: string) => string | null
} = useFormValidation()
```

**Regras de Validação**:
- **Email**: Regex RFC 5322
- **Password**: Mínimo 8 caracteres, letras e números
- **Username**: 3-20 caracteres, alfanumérico + underscore

---

## 📦 State Management

### Auth Store

**Arquivo**: `src/stores/auth.ts`

Store Pinia persistente com informações do usuário autenticado.

**State**:
```typescript
interface UserStore {
  userId: string
  username: string
  email: string
  profileImage?: string
}
```

**API**:
```typescript
const authStore = useAuthStore()

// State
authStore.userStore       // UserStore | null
authStore.isAuthenticated // boolean (computed)

// Actions
await authStore.login(user)
await authStore.logout()
await authStore.fetchUser()  // Fetch de /api/users/me
```

**Persistência**:
```typescript
// Configuração do plugin
defineStore('auth', () => {
  // ...
}, {
  persist: true  // Auto-salva no localStorage
})
```

---

## 🔌 Integração com Backend

### SignalR (Game Engine)

**Arquivo**: `src/services/gameEngineService.ts`

Cliente SignalR para comunicação em tempo real com `location404-game`.

**Conexão**:
```typescript
const connection = new HubConnectionBuilder()
  .withUrl(`${GAME_API_URL}/gamehub`, {
    withCredentials: true,  // Envia cookies (JWT)
    transport: HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build()

await connection.start()
```

**Métodos do Hub**:
```typescript
// JoinMatchmaking
await connection.invoke('JoinMatchmaking', {
  playerId: userId
})

// SubmitGuess
await connection.invoke('SubmitGuess', {
  matchId: matchId,
  roundId: roundId,
  playerId: userId,
  coordinate: { x: 48.8566, y: 2.3522 }
})

// LeaveMatchmaking
await connection.invoke('LeaveMatchmaking', {
  playerId: userId
})
```

**Eventos do Servidor**:
```typescript
// MatchFound
connection.on('MatchFound', (data: MatchFoundResponse) => {
  console.log('Partida encontrada:', data.matchId)
})

// RoundStarted
connection.on('RoundStarted', (data: RoundStartedResponse) => {
  console.log('Round iniciado:', data.roundNumber)
  console.log('Location:', data.location)
})

// RoundEnded
connection.on('RoundEnded', (data: RoundEndedResponse) => {
  console.log('Resultado do round:', data.results)
})

// MatchEnded
connection.on('MatchEnded', (data: MatchEndedResponse) => {
  console.log('Partida finalizada:', data.winner)
})
```

**Tratamento de Erros**:
```typescript
connection.onclose((error) => {
  console.error('Conexão perdida:', error)
  // Auto-reconnect configurado
})

connection.onreconnected((connectionId) => {
  console.log('Reconectado:', connectionId)
})
```

---

### REST APIs

**Arquivo**: `src/services/userIdentityService.ts`, `geoDataService.ts`

Cliente Axios para APIs HTTP.

#### Auth API (location404-auth)

**Endpoints**:
```typescript
// POST /api/auth/login
await axios.post(`${AUTH_API_URL}/api/auth/login`, {
  email: 'user@example.com',
  password: 'password123'
})
// Response: { userId, accessToken, refreshToken }
// Cookies setados automaticamente

// POST /api/auth/register
await axios.post(`${AUTH_API_URL}/api/auth/register`, {
  username: 'player1',
  email: 'user@example.com',
  password: 'password123'
})

// GET /api/users/me
await axios.get(`${AUTH_API_URL}/api/users/me`, {
  withCredentials: true  // Envia cookies
})
// Response: { id, username, email, profileImage }

// POST /api/auth/logout
await axios.post(`${AUTH_API_URL}/api/auth/logout`, {}, {
  withCredentials: true
})
```

#### Data API (location404-data)

**Endpoints**:
```typescript
// GET /api/locations/random
await axios.get(`${DATA_API_URL}/api/locations/random`)
// Response: { id, coordinate, name, country, heading, pitch }

// GET /api/players/{playerId}/stats
await axios.get(`${DATA_API_URL}/api/players/${playerId}/stats`)
// Response: { playerId, totalMatches, wins, losses, winRate, rankingPoints }

// GET /api/players/ranking?limit=10
await axios.get(`${DATA_API_URL}/api/players/ranking`, {
  params: { limit: 10 }
})
// Response: [ { playerId, username, rankingPoints, totalMatches } ]

// GET /api/players/{playerId}/matches
await axios.get(`${DATA_API_URL}/api/players/${playerId}/matches`)
// Response: [ { matchId, createdAt, rounds: [...], winner } ]
```

**Configuração do Axios**:
```typescript
// src/config/axios.config.ts
const axiosInstance = axios.create({
  withCredentials: true,  // Sempre envia cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redireciona para login
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

---

## 🛣️ Rotas

**Arquivo**: `src/router/index.ts`

Configuração do Vue Router com guards de autenticação.

| Rota              | Componente         | Autenticação | Descrição                          |
|-------------------|--------------------|--------------|-------------------------------------|
| `/`               | Redirect           | -            | Redireciona para `/play`           |
| `/login`          | `LoginView`        | ❌ Não       | Tela de login                       |
| `/register`       | `RegisterView`     | ❌ Não       | Tela de registro                    |
| `/play`           | `PlayView`         | ✅ Sim       | Tela principal do jogo              |
| `/ranking`        | `RankingView`      | ✅ Sim       | Ranking global de jogadores         |
| `/stats`          | `PlayerStatsView`  | ✅ Sim       | Estatísticas detalhadas do jogador  |
| `/config`         | `ConfigView`       | ✅ Sim       | Configurações do perfil             |

**Navigation Guard**:
```typescript
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const store = useAuthStore()

  if (requiresAuth && !store.isAuthenticated) {
    next({ name: 'login' })  // Redireciona para login
  } else if (to.name === 'login' && store.isAuthenticated) {
    next({ name: 'play' })   // Usuário autenticado não acessa login
  } else {
    next()
  }
})
```

---

## 🧪 Testes

### Executando Testes

```bash
# Executa testes em modo watch
npm run test

# Executa testes com UI interativa
npm run test:ui

# Executa testes com cobertura
npm run test:coverage
```

### Estrutura de Testes

Todos os testes seguem o padrão `__tests__` dentro de cada módulo:

```
src/
├── components/__tests__/
├── composables/__tests__/
├── core/__tests__/
├── router/__tests__/
├── services/__tests__/
├── stores/__tests__/
├── types/__tests__/
└── utils/__tests__/
```

### Cobertura Atual

| Módulo            | Cobertura | Status |
|-------------------|-----------|--------|
| `core/`           | 100%      | ✅     |
| `stores/`         | 100%      | ✅     |
| `utils/`          | 100%      | ✅     |
| `types/`          | 100%      | ✅     |
| `composables/`    | Parcial   | ⚠️     |
| `components/`     | 0%        | ❌     |
| `services/`       | 0%        | ❌     |

### Exemplo de Teste

```typescript
// src/core/__tests__/container.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { container } from '../container'

describe('Container', () => {
  beforeEach(() => {
    container.clear()
  })

  it('deve registrar e resolver um serviço', () => {
    // Arrange
    const testService = { name: 'test' }
    const token = Symbol('TEST_SERVICE')

    // Act
    container.register(token, () => testService)
    const resolved = container.resolve(token)

    // Assert
    expect(resolved).toBe(testService)
  })
})
```

---

## 📦 Build e Deploy

### Build de Produção

```bash
# Build otimizado com tree-shaking e minificação
npm run build

# Saída gerada em dist/
dist/
├── assets/
│   ├── index-[hash].js     # Bundle principal
│   ├── vendor-[hash].js    # Dependências (code splitting)
│   └── *.css               # Estilos compilados
├── index.html
└── favicon.ico
```

### Variáveis de Ambiente de Build

Crie `.env.production` para valores de produção:

```bash
VITE_AUTH_API=https://auth.location404.com
VITE_GAME_API=https://game.location404.com
VITE_DATA_API=https://data.location404.com
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Deploy (Docker + Nginx)

**Dockerfile**:
```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # SPA routing (todas as rotas servem index.html)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache de assets com hash
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Build e Push**:
```bash
docker build -t location404-web:latest .
docker tag location404-web:latest registry.com/location404-web:latest
docker push registry.com/location404-web:latest
```

---

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`PlayForm.vue`, `GuessMap.vue`)
- **Composables**: camelCase com prefixo `use` (`useGameEngine`, `useGeoData`)
- **Serviços**: camelCase com sufixo `Service` (`gameEngineService`, `geoDataService`)
- **Tipos**: PascalCase com sufixo `Type` ou interface (`GameState`, `Coordinate`)
- **Constantes**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

### Organização de Imports

```typescript
// 1. Vue core
import { ref, computed, onMounted } from 'vue'

// 2. Libraries
import axios from 'axios'

// 3. Composables
import { useGameEngine, useToast } from '@/composables'

// 4. Stores
import { useAuthStore } from '@/stores/auth'

// 5. Types
import type { GameState, Coordinate } from '@/types'

// 6. Components (se necessário)
import PlayForm from '@/components/PlayForm.vue'
```

### TypeScript

- Sempre tipar props, emits e retornos de funções
- Usar `interface` para objetos públicos, `type` para unions/intersections
- Evitar `any`, preferir `unknown` quando tipo é desconhecido
- Usar `as const` para objetos literais imutáveis

### Vue Style Guide

Seguir [Vue.js Style Guide (Priority A)](https://vuejs.org/style-guide/):

- Componentes sempre multi-palavra (`PlayForm`, não `Play`)
- Props detalhadas com tipos e defaults
- `<script setup>` para Composition API
- `<style scoped>` para evitar vazamento de estilos

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **[ryanbromati](https://github.com/ryanbromati)** como parte do Trabalho de Conclusão de Curso (TCC).

---

**Location404** - Explore o mundo, desafie seus amigos, domine o ranking! 🌍🎮
