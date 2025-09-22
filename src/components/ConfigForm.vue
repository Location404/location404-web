<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="w-[90%] md:w-[80%] min-h-[80vh] shrink-0 flex flex-col md:flex-row items-start justify-start gap-10
             bg-white/15 backdrop-blur-md rounded-2xl shadow-xl
             border border-white/25 ring-1 ring-green-light/20
             mb-20 p-6 md:p-10"
    >
      <aside class="w-full md:w-1/4 flex flex-col gap-4">
        <button class="py-2 px-4 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition text-left">
          Perfil
        </button>
        <button class="py-2 px-4 rounded-lg bg-red-500/80 text-white font-semibold hover:bg-red-600 transition text-left">
          Desconectar
        </button>
      </aside>

      <form class="w-full md:w-3/4 flex flex-col gap-6 text-white">
        <div class="flex flex-col md:flex-row gap-8">
          
          <div class="flex-grow flex flex-col gap-4">
            <label class="flex items-center">
              <span class="w-[70px] shrink-0">Apelido:</span>
              <input
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
              />
            </label>

            <label class="flex items-center">
              <span class="min-w-[70px] shrink-0">Ícone:</span>
              <input
                type="file"
                class="w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
              />
            </label>

            <label class="flex items-center">
              <span class="w-[70px] shrink-0">Email:</span>
              <input
                type="email"
                class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
              />
            </label>
          </div>
          
          <div class="w-full md:w-auto flex justify-center items-start">
            <div class="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-black/20 rounded-2xl flex items-center justify-center border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white/40" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 w-full">
          <label class="flex-1 flex flex-col gap-1">
            <span>Senha:</span>
            <input
              type="password"
              class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </label>
          <label class="flex-1 flex flex-col gap-1">
            <span>Confirmar Senha:</span>
            <input
              type="password"
              class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </label>
        </div>

        <div class="flex justify-end mt-4">
          <button
            type="submit"
            class="py-2 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>