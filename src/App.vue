<template>
  <RouterView />

  <Toaster richColors position="top-right" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import 'vue-sonner/style.css'

const authStore = useAuthStore()

// Initialize authentication on app mount
onMounted(async () => {
  // Only fetch if we have persisted auth data
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
      console.log('[App] User profile refreshed from /me')
    } catch (error) {
      console.warn('[App] Failed to refresh user profile, user might need to login again')
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

