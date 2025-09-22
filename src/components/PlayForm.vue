<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="relative w-[80%] md:w-[80%] min-h-[80vh] flex flex-col items-start justify-start gap-10 border-2 border-white/25 rounded-2xl shadow-xl mb-20 p-6 md:p-10 overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center filter blur-sm"
        :style="{ backgroundImage: `url(${background})` }"
      ></div>
      <div
        class="relative z-10 w-full h-full flex items-center justify-center"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import background from "../assets/bg.png";
</script>
