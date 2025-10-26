import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PlayView from '../views/PlayView.vue'
import RankingView from '../views/RankingView.vue'
import ConfigView from '@/views/ConfigView.vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/config/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: ROUTE_PATHS.PLAY,
    },
    {
      path: ROUTE_PATHS.LOGIN,
      name: ROUTE_NAMES.LOGIN,
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: ROUTE_PATHS.REGISTER,
      name: ROUTE_NAMES.REGISTER,
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: ROUTE_PATHS.PLAY,
      name: ROUTE_NAMES.PLAY,
      component: PlayView,
      meta: { requiresAuth: true },
    },
    {
      path: ROUTE_PATHS.RANKING,
      name: ROUTE_NAMES.RANKING,
      component: RankingView,
      meta: { requiresAuth: true },
    },
    {
      path: ROUTE_PATHS.CONFIG,
      name: ROUTE_NAMES.CONFIG,
      component: ConfigView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const store = useAuthStore()

  if (requiresAuth && !store.isAuthenticated) {
    next({ name: ROUTE_NAMES.LOGIN })
  } else if (to.name === ROUTE_NAMES.LOGIN && store.isAuthenticated) {
    next({ name: ROUTE_NAMES.PLAY })
  } else {
    next()
  }
})

export default router
