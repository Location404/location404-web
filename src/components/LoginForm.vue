<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-light via-gray-600 to-green-medium px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-4">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center">
          <img src="/logo.png" alt="Location404" class="object-contain h-40 w-40" />
        </div>
        <h2 class="text-3xl font-bold text-white">Bem-vindo de volta</h2>
        <p class="text-blue-light">Entre na sua conta Location404</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/25 ring-1 ring-green-light/20">
          <div class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-white mb-2">
                Senha
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-blue-light focus:ring-blue-light border-white/30 rounded bg-white/20"
                />
                <label for="remember" class="ml-2 block text-sm text-white">
                  Lembrar de mim
                </label>
              </div>
              <a href="#" class="text-sm text-white hover:text-blue-light transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-medium to-green-medium hover:from-blue-dark hover:to-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-light/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="text-white/80">
              Não tem uma conta?
              <router-link to="/register" class="font-medium text-green-light hover:text-green-medium transition-colors">
                Cadastre-se aqui
              </router-link>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authService, type LoginRequest, type LoginResponse } from '@/services/userIdentityService'
import { toast } from 'vue-sonner'
import { authStore } from '@/stores/auth'
import router from '@/router'

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  
  const loginRequest: LoginRequest = {
    email: form.email,
    password: form.password
  }

  try {
    toast.promise(authService.login(loginRequest), {
      loading: 'Autenticando...',
      success: (data: LoginResponse) => {
        authStore().login(
          { 
            id: data.id, 
            email: data.email, 
            name: data.username 
          }, 
          data.accessToken, 
          data.refreshToken)

        router.push('/play')
        return 'Login realizado com sucesso!'
      },
      error: (err: any) => {
        return err.message || err.response?.data?.message || 'Erro ao fazer login. Tente novamente mais tarde.'
      }
    })
  } catch (error: unknown) {
    console.error('Erro inesperado:', error)
  } finally {
    loading.value = false
  }
}
</script>

