import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    isAuthenticated: false,
    email: null as string | null,
    name: null as string | null
  })

  const isAuthenticated = computed(() => user.value.isAuthenticated)
  const userEmail = computed(() => user.value.email)
  const userName = computed(() => user.value.name)

  function login(userData: { email: string; name: string }) {
    user.value = {
      isAuthenticated: true,
      email: userData.email,
      name: userData.name
    }
  }

  function logout() {
    user.value = {
      isAuthenticated: false,
      email: null,
      name: null
    }
  }

  return {
    user,
    isAuthenticated,
    userEmail,
    userName,
    login,
    logout
  }
})

