import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'universal-cookie'

const cookies = new Cookies(null, { path: '/' });

const accessToken = ref<string | null>(cookies.get('accessToken'))
const refreshToken = ref<string | null>(cookies.get('refreshToken'))

const getInitialUser = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser)
      if (parsedUser.isAuthenticated) {
        return parsedUser
      }
    } catch (e) {
      localStorage.removeItem('user')
    }
  }
  else {
    //TODO: call /me to check if the user is authenticated
  }
  return {
    isAuthenticated: false,
    id: null as string | null,
    email: null as string | null,
    name: null as string | null,
  }
}

const user = ref(getInitialUser())
const isAuthenticated = computed(() => user.value.isAuthenticated)
const userName = computed(() => user.value.name)
const userId = computed(() => user.value.id)

export const useAuthStore = defineStore('auth', () => {
  function login(userData: { email: string; name: string; id: string }) {
    user.value = {
      isAuthenticated: true,
      id: userData.id,
      email: userData.email,
      name: userData.name
    }
    
    localStorage.setItem('user', JSON.stringify(user.value));
    
    accessToken.value = cookies.get('accessToken')
    refreshToken.value = cookies.get('refreshToken')
  }

  function logout() {
    user.value = {
      isAuthenticated: false,
      id: null,
      email: null,
      name: null
    }

    accessToken.value = null
    refreshToken.value = null

    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    localStorage.removeItem('user')
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    userName,
    login,
    logout
  }
})