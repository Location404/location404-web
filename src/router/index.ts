import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PlayView from '../views/PlayView.vue'
import ConfigView from '@/views/ConfigView.vue'
import { authStore } from '@/stores/auth'

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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log('Navigating to:', to.fullPath, 'Requires Auth:', requiresAuth);
  console.log('Is Authenticated:', authStore().isAuthenticated);
  if (requiresAuth && !authStore().isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore().isAuthenticated) {
    next({ name: 'play' });
  } else {
    next();
  }
});

export default router
