import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

let accessToken: string | null = null
let refreshToken: string | null = null

export const authStore = defineStore('auth', () => {
  const user = ref({
    isAuthenticated: false,
    id: null as string | null,
    email: null as string | null,
    name: null as string | null,
  })

  function setAccessToken(token: string | null) {
    accessToken = token
  }

  function setRefreshToken(token: string | null) {
    refreshToken = token
  }

  function getRefreshToken(): string | null {
    return refreshToken
  }

  function getAccessToken(): string | null {
    return accessToken
  }

  const isAuthenticated = computed(() => user.value.isAuthenticated)
  const userEmail = computed(() => user.value.email)
  const userName = computed(() => user.value.name)

  function login(userData: { email: string; name: string; id: string }, token: string, refresh: string) {
    user.value = {
      isAuthenticated: true,
      id: userData.id,
      email: userData.email,
      name: userData.name
    }
    
    setAccessToken(token)
    setRefreshToken(refresh)
  }

  function logout() {
    user.value = {
      isAuthenticated: false,
      id: null,
      email: null,
      name: null
    }

    setAccessToken(null)
    
  }

  return {
    user,
    isAuthenticated,
    userEmail,
    userName,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken
  }
})

