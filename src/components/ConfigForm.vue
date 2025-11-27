<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="w-[80%] md:w-[80%] min-h-[80vh] shrink-0 flex flex-col md:flex-row items-start justify-start gap-10 relative bg-white/15 rounded-2xl shadow-xl border-2 border-white/25 ring-1 ring-green-light/20 mb-20 p-6 md:p-10 overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center filter blur-sm"
        :style="{ backgroundImage: `url(${background})` }"
      ></div>

      <aside class="w-full md:w-1/4 flex flex-col gap-4 relative z-10">
        <button
          class="py-2 px-4 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition text-left"
        >
          Perfil
        </button>
        <button
          class="py-2 px-4 rounded-lg bg-red-500/80 text-white font-semibold hover:bg-red-600 transition text-left"
          @click="handleLogout"
        >
          Desconectar
        </button>
      </aside>

      <form
        v-if="userProfile"
        @submit.prevent="saveProfile"
        class="w-full md:w-3/4 flex flex-col gap-6 text-white relative z-10"
      >
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-grow flex flex-col gap-4">
            <label class="flex items-center">
              <span class="w-[70px] shrink-0">Apelido:</span>
              <input
                type="text"
                v-model="userProfile.username"
                class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
              />
            </label>

            <label class="flex items-center">
              <span class="min-w-[70px] shrink-0">Ícone:</span>
              <input
                type="file"
                @change="onFileSelected"
                accept="image/*"
                class="w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
              />
            </label>

            <label class="flex items-center">
              <span class="w-[70px] shrink-0">Email:</span>
              <input
                type="email"
                v-model="userProfile.email"
                class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
              />
            </label>
          </div>

          <div class="w-full md:w-auto flex justify-center items-start">
            <div
              class="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-black/20 rounded-2xl flex items-center justify-center border border-white/20 overflow-hidden"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Prévia do perfil"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-16 h-16 text-white/40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 w-full">
          <label class="flex-1 flex flex-col gap-1">
            <span>Senha:</span>
            <input
              type="password"
              v-model="password"
              autocomplete="new-password"
              placeholder="•••••••••••••"
              class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
            <div v-if="password" class="mt-2">
              <div class="flex space-x-1">
                <div
                  :class="[
                    'h-1 w-full rounded',
                    passwordStrength.score >= 1 ? passwordStrength.color : 'bg-white/20',
                  ]"
                ></div>
                <div
                  :class="[
                    'h-1 w-full rounded',
                    passwordStrength.score >= 2 ? passwordStrength.color : 'bg-white/20',
                  ]"
                ></div>
                <div
                  :class="[
                    'h-1 w-full rounded',
                    passwordStrength.score >= 3 ? passwordStrength.color : 'bg-white/20',
                  ]"
                ></div>
              </div>
              <p class="text-xs text-white/70 mt-1">
                {{ passwordStrength.label }}
              </p>
            </div>
          </label>
          <label class="flex-1 flex flex-col gap-1">
            <span>Confirmar Senha:</span>
            <input
              type="password"
              v-model="confirmPassword"
              autocomplete="new-password"
              placeholder="•••••••••••••"
              class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
            <p
              v-if="confirmPassword && password && !passwordsMatch(password, confirmPassword)"
              class="text-red-300 text-xs mt-1"
            >
              As senhas não coincidem
            </p>
          </label>
        </div>

        <div class="flex justify-end mt-4">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="py-2 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserIdentityService, useToast, useFormValidation } from '@/composables'
import { ROUTE_NAMES } from '@/config/constants'
import { base64ToDataUrl, createImagePreview } from '@/utils/image-utils'
import type { UserProfile } from '@/types'
import background from '../assets/bg.png'

const router = useRouter()
const authStore = useAuthStore()
const userIdentityService = useUserIdentityService()
const { success: toastSuccess, error: toastError } = useToast()
const { calculatePasswordStrength, passwordsMatch } = useFormValidation()

const userProfile = ref<UserProfile | null>(null)
const originalUserProfile = ref<UserProfile | null>(null)
const password = ref('')
const confirmPassword = ref('')
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const loading = ref(false)

const passwordStrength = computed(() => calculatePasswordStrength(password.value))

const isFormValid = computed(() => {
  if (!userProfile.value) return false

  if (!userProfile.value.username?.trim()) return false

  if (!userProfile.value.email?.trim()) return false

  if (password.value) {
    if (passwordStrength.value.score < 2) return false

    if (!passwordsMatch(password.value, confirmPassword.value)) return false
  }

  return true
})

function handleLogout() {
  authStore.logout()
  router.push({ name: ROUTE_NAMES.LOGIN })
}

async function fetchUserProfile() {
  try {
    const profileData = await userIdentityService.getUserProfile()
    userProfile.value = profileData
    originalUserProfile.value = JSON.parse(JSON.stringify(profileData))

    if (profileData.profileImage) {
      const dataUrl = base64ToDataUrl(profileData.profileImage)
      if (dataUrl) {
        imagePreview.value = dataUrl
      } else {
        toastError('Tipo de imagem desconhecido. Não é possível exibir o ícone do perfil.')
        imagePreview.value = null
      }
    } else {
      imagePreview.value = null
    }
  } catch (error) {
    toastError(error, 'Não foi possível carregar o perfil do usuário.')
    handleLogout()
  }
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file
    imagePreview.value = createImagePreview(file)
  }
}

async function saveProfile() {
  if (!userProfile.value || !originalUserProfile.value) {
    return
  }

  if (!isFormValid.value) {
    toastError('Preencha todos os campos corretamente!')
    return
  }

  if (password.value && !passwordsMatch(password.value, confirmPassword.value)) {
    toastError('As senhas não conferem!')
    return
  }

  // Check if there are changes
  const hasProfileChanges =
    userProfile.value.username !== originalUserProfile.value.username ||
    userProfile.value.email !== originalUserProfile.value.email ||
    (password.value && password.value.trim() !== '') ||
    selectedFile.value !== null

  if (!hasProfileChanges) {
    toastError('Nenhuma alteração foi feita.')
    return
  }

  loading.value = true

  try {
    await userIdentityService.updateUserProfile({
      id: userProfile.value.id,
      username: userProfile.value.username || '',
      email: userProfile.value.email || '',
      password: password.value || undefined,
      profileImage: selectedFile.value,
    })

    toastSuccess('Perfil salvo com sucesso!')

    // Refresh profile
    await fetchUserProfile()

    // Clear password fields
    password.value = ''
    confirmPassword.value = ''
    selectedFile.value = null
  } catch (error) {
    console.error('Falha ao salvar o perfil:', error)
    toastError(error, 'Não foi possível salvar o perfil. Tente novamente mais tarde.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>
