<template>
  <nav class="p-2 sm:p-4 flex items-center justify-center">
    <div class="relative w-[81%] flex items-center justify-center p-2 bg-white/15 backdrop-blur-md rounded-full shadow-xl border border-white/25 ring-1 ring-green-light/20">

      <div class="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 sm:space-x-3">
        <img src="/public/logo.png" alt="Location404 Logo" class="h-10 w-10 sm:h-12 sm:w-12"/>
        <span class="text-white font-bold text-lg sm:text-xl hidden sm:inline">Location404</span>
      </div>

      <div class="flex items-center space-x-3 sm:space-x-8">
        
        <router-link
          to="/play"
          class="py-2 px-4 sm:px-6 rounded-full text-white font-semibold bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-green-light/50 transition-all duration-200 text-sm sm:text-base"
        >
          Jogar
        </router-link>
        
        <router-link
          to="/config" 
          class="py-2 px-4 sm:px-6 rounded-full text-white font-semibold bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-blue-light/50 transition-all duration-200 text-sm sm:text-base flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="hidden md:inline">Configurações</span>
        </router-link>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>