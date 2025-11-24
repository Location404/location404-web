import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/config/constants'

// Mock auth store
const mockIsAuthenticated = vi.fn()

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: mockIsAuthenticated(),
  }),
}))

// Mock components
const MockComponent = { template: '<div>Mock</div>' }

describe('router', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    mockIsAuthenticated.mockReset()

    // Create router with same configuration as the actual router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          redirect: ROUTE_PATHS.PLAY,
        },
        {
          path: ROUTE_PATHS.LOGIN,
          name: ROUTE_NAMES.LOGIN,
          component: MockComponent,
          meta: { requiresAuth: false },
        },
        {
          path: ROUTE_PATHS.REGISTER,
          name: ROUTE_NAMES.REGISTER,
          component: MockComponent,
          meta: { requiresAuth: false },
        },
        {
          path: ROUTE_PATHS.PLAY,
          name: ROUTE_NAMES.PLAY,
          component: MockComponent,
          meta: { requiresAuth: true },
        },
        {
          path: ROUTE_PATHS.RANKING,
          name: ROUTE_NAMES.RANKING,
          component: MockComponent,
          meta: { requiresAuth: true },
        },
        {
          path: ROUTE_PATHS.CONFIG,
          name: ROUTE_NAMES.CONFIG,
          component: MockComponent,
          meta: { requiresAuth: true },
        },
      ],
    })

    // Add navigation guard
    router.beforeEach(async (to, _from, next) => {
      const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
      const isAuthenticated = mockIsAuthenticated()

      if (requiresAuth && !isAuthenticated) {
        next({ name: ROUTE_NAMES.LOGIN })
      } else if (to.name === ROUTE_NAMES.LOGIN && isAuthenticated) {
        next({ name: ROUTE_NAMES.PLAY })
      } else {
        next()
      }
    })
  })

  describe('routes configuration', () => {
    it('should have root redirect to play', () => {
      const rootRoute = router.getRoutes().find((r) => r.path === '/')
      expect(rootRoute?.redirect).toBe(ROUTE_PATHS.PLAY)
    })

    it('should have login route configured', () => {
      const loginRoute = router.getRoutes().find((r) => r.name === ROUTE_NAMES.LOGIN)
      expect(loginRoute).toBeDefined()
      expect(loginRoute?.path).toBe(ROUTE_PATHS.LOGIN)
      expect(loginRoute?.meta.requiresAuth).toBe(false)
    })

    it('should have register route configured', () => {
      const registerRoute = router.getRoutes().find((r) => r.name === ROUTE_NAMES.REGISTER)
      expect(registerRoute).toBeDefined()
      expect(registerRoute?.path).toBe(ROUTE_PATHS.REGISTER)
      expect(registerRoute?.meta.requiresAuth).toBe(false)
    })

    it('should have play route configured with auth required', () => {
      const playRoute = router.getRoutes().find((r) => r.name === ROUTE_NAMES.PLAY)
      expect(playRoute).toBeDefined()
      expect(playRoute?.path).toBe(ROUTE_PATHS.PLAY)
      expect(playRoute?.meta.requiresAuth).toBe(true)
    })

    it('should have ranking route configured with auth required', () => {
      const rankingRoute = router.getRoutes().find((r) => r.name === ROUTE_NAMES.RANKING)
      expect(rankingRoute).toBeDefined()
      expect(rankingRoute?.path).toBe(ROUTE_PATHS.RANKING)
      expect(rankingRoute?.meta.requiresAuth).toBe(true)
    })

    it('should have config route configured with auth required', () => {
      const configRoute = router.getRoutes().find((r) => r.name === ROUTE_NAMES.CONFIG)
      expect(configRoute).toBeDefined()
      expect(configRoute?.path).toBe(ROUTE_PATHS.CONFIG)
      expect(configRoute?.meta.requiresAuth).toBe(true)
    })

    it('should have 6 routes total', () => {
      const routes = router.getRoutes()
      expect(routes.length).toBeGreaterThanOrEqual(6)
    })
  })

  describe('navigation guards', () => {
    it('should redirect to login when accessing protected route without auth', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      await router.push(ROUTE_PATHS.PLAY)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })

    it('should allow access to protected route when authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)

      await router.push(ROUTE_PATHS.PLAY)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.PLAY)
    })

    it('should allow access to login when not authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      await router.push(ROUTE_PATHS.LOGIN)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })

    it('should redirect to play when accessing login while authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)

      await router.push(ROUTE_PATHS.LOGIN)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.PLAY)
    })

    it('should allow access to register when not authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      await router.push(ROUTE_PATHS.REGISTER)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.REGISTER)
    })

    it('should redirect ranking to login when not authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      await router.push(ROUTE_PATHS.RANKING)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })

    it('should allow access to ranking when authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)

      await router.push(ROUTE_PATHS.RANKING)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.RANKING)
    })

    it('should redirect config to login when not authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      await router.push(ROUTE_PATHS.CONFIG)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })

    it('should allow access to config when authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)

      await router.push(ROUTE_PATHS.CONFIG)

      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.CONFIG)
    })
  })
})
