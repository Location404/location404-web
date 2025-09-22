<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-light via-gray-600 to-green-medium px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-4">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center">
          <img src="/logo.png" alt="Location404" class="object-contain h-40 w-40" />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Criar conta</h2>
        <p class="text-blue-light">Junte-se ao Location404</p>
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/25 ring-1 ring-green-light/20">
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-white mb-2">
                Apelido
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                placeholder="pedrin"
              />
            </div>

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
                placeholder="pedrin@example.com"
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
                  placeholder="••••••••••"
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
              <div class="mt-2">
                <div class="flex space-x-1">
                  <div :class="['h-1 w-full rounded', passwordStrength >= 1 ? 'bg-red-400' : 'bg-white/20']"></div>
                  <div :class="['h-1 w-full rounded', passwordStrength >= 2 ? 'bg-yellow-400' : 'bg-white/20']"></div>
                  <div :class="['h-1 w-full rounded', passwordStrength >= 3 ? 'bg-green-400' : 'bg-white/20']"></div>
                </div>
                <p class="text-xs text-white/70 mt-1">
                  {{ passwordStrengthText }}
                </p>
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                placeholder="••••••••••"
              />
              <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-300 text-xs mt-1">
                As senhas não coincidem
              </p>
            </div>

            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-light focus:ring-blue-light border-white/30 rounded bg-white/20"
              />
              <label for="terms" class="ml-2 block text-sm text-white">
                Aceito os 
                <a href="#" class="text-green-light hover:text-green-medium transition-colors underline">
                  termos de uso
                </a>
                e 
                <a href="#" class="text-green-light hover:text-green-medium transition-colors underline">
                  política de privacidade
                </a>
              </label>
            </div>
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-medium to-green-medium hover:from-blue-dark hover:to-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-light/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Criando conta...' : 'Criar conta' }}
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="text-white/80">
              Já tem uma conta?
              <router-link to="/login" class="font-medium text-green-light hover:text-green-medium transition-colors">
                Entre aqui
              </router-link>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type RegisterRequest } from '@/services/userIdentityService'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'

const router = useRouter()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const passwordStrength = computed(() => {
  const password = form.password
  let strength = 0

  if (password.length >= 6) strength ++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
  if (/\d/.test(password)) strength++

  return strength
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0: return 'Muito fraca'
    case 1: return 'Fraca'
    case 2: return 'Média'
    case 3: return 'Forte'
    default: return ''
  }
})

const isFormValid = computed(() => {
  return form.name &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.acceptTerms &&
    passwordStrength.value >= 2
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  const registerReRegisterRequest: RegisterRequest = {
    username: form.name,
    email: form.email,
    password: form.password
  }

  toast.promise(
    authService.register(registerReRegisterRequest),
    {
      loading: 'Criando sua conta...',
      success: () => {
        router.push('/login');
        return 'Conta criada com sucesso!'
      },
      error: (err) => {
        console.error(err)
        return err.response?.data?.message || err.message || 'Erro ao criar conta. Tente novamente mais tarde.'
      }
    }
  )
}
</script>