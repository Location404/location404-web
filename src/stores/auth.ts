import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserStore } from '@/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userStore = ref<UserStore | null>(null)
    const isAuthenticated = computed(() => !!userStore.value)

    async function login(user: UserStore) {
      userStore.value = user
    }

    async function logout() {
      try {
        // await useUserIdentityService.logout()
      } finally {
        userStore.value = null
      }
    }

    return {
      userStore,
      isAuthenticated,
      login,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
