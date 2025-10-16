<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="relative w-[80%] md:w-[80%] min-h-[80vh] flex flex-col items-start justify-start gap-10 border-2 border-white/25 rounded-2xl shadow-xl mb-20 p-6 md:p-10 overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center filter blur-sm"
        :style="{ backgroundImage: `url(${background})` }"
      ></div>
<div class="relative z-10 w-full h-full flex grow items-center justify-center">
        
        <button
          type="button"
          class="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full text-white bg-white/10 hover:bg-white/20 focus:outline-none transition-all duration-200"
          aria-label="Play">
          
          <svg class="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>                                                                                                  
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import background from "../assets/bg.png";
</script>
