import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserStore } from '@/types'
import { UserIdentityService } from '@/services/userIdentityService'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userStore = ref<UserStore | null>(null)
    const isAuthenticated = computed(() => !!userStore.value)
    const userIdentityService = new UserIdentityService()

    async function login(user: UserStore) {
      userStore.value = user
    }

    async function logout() {
      try {
        // await userIdentityService.logout()
      } finally {
        userStore.value = null
      }
    }

    /**
     * Fetch current user from /me endpoint
     * and update the store
     */
    async function fetchUser() {
      try {
        const profile = await userIdentityService.getUserProfile()
        userStore.value = {
          userId: profile.id,
          username: profile.username,
          email: profile.email,
          profileImage: profile.profileImage,
        }
        return profile
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // If fetch fails, clear the store (user might not be authenticated)
        userStore.value = null
        throw error
      }
    }

    return {
      userStore,
      isAuthenticated,
      login,
      logout,
      fetchUser,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)
