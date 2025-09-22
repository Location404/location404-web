import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PlayView from '../views/PlayView.vue'
import ConfigView from '@/views/ConfigView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/play'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/play',
      name: 'play',
      component: PlayView,
      meta: { requiresAuth: true }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const store = useAuthStore()

  if (requiresAuth && !store.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && store.isAuthenticated) {
    next({ name: 'play' })
  } else {
    next()
  }
})

export default router
