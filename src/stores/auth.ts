import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type UserStore = {
  userId: string
  username: string
  email: string
  profileImage: string | null
} | null

export const useAuthStore = defineStore('auth', () => {
  const userStore = ref<UserStore>(null)
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
    logout 
  }
}, 
{
  persist: {
    storage: localStorage
  }
})