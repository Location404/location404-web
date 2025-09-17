import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export const authStore = defineStore('auth', () => {
  const user = ref({
    isAuthenticated: false,
    id: null as string | null,
    email: null as string | null,
    name: null as string | null
  })

  const isAuthenticated = computed(() => user.value.isAuthenticated)
  const userEmail = computed(() => user.value.email)
  const userName = computed(() => user.value.name)

  function login(userData: { email: string; name: string; id: string }) {
    user.value = {
      isAuthenticated: true,
      id: userData.id,
      email: userData.email,
      name: userData.name
    }
  }

  function logout() {
    user.value = {
      isAuthenticated: false,
      id: null,
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

