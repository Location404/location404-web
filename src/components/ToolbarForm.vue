<template>
  <nav class="p-4 flex items-center justify-center">
    <div class="w-[80%] flex items-center justify-center p-2 bg-white/15 backdrop-blur-md rounded-full shadow-xl border border-white/25 ring-1 ring-green-light/20">

      <div class="flex items-center space-x-10">
        
        <router-link
          to="/play"
          class="py-2 px-6 rounded-full text-white font-semibold bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-green-light/50 transition-all duration-200"
        >
          Jogar
        </router-link>
        
        <router-link
          to="/config" class="py-2 px-6 rounded-full text-white font-semibold bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-blue-light/50 transition-all duration-200"
        >
          Configurações
        </router-link>

        </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>