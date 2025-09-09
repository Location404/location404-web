<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-4">
            <div class="h-16 w-16 flex items-center justify-center rounded-full bg-blue-light">
              <img src="/logo.png" alt="Location404" class="h-10 w-10" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p class="text-gray-600">Bem-vindo, {{ authStore.userName }}!</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-dark mb-2">Localizações</h3>
            <p class="text-3xl font-bold text-blue-medium">42</p>
            <p class="text-blue-dark/70">Total de locais</p>
          </div>
          
          <div class="bg-green-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-green-dark mb-2">Usuários</h3>
            <p class="text-3xl font-bold text-green-medium">1,234</p>
            <p class="text-green-dark/70">Usuários ativos</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-dark mb-2">Relatórios</h3>
            <p class="text-3xl font-bold text-gray-600">89</p>
            <p class="text-gray-dark/70">Este mês</p>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
          <div class="bg-gray-50 rounded-lg p-6">
            <p class="text-gray-600">Nenhuma atividade recente para mostrar.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

