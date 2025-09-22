<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="w-[90%] md:w-[80%] min-h-[80vh] shrink-0 flex flex-col md:flex-row items-center justify-center gap-10
             bg-white/15 backdrop-blur-md rounded-2xl shadow-xl
             border border-white/25 ring-1 ring-green-light/20
             mb-56 p-4 md:p-10"
    >
      <button
        class="w-[80%] md:w-[30%] h-[20vh] flex items-center justify-center
               bg-white/15 backdrop-blur-md rounded-2xl shadow-xl
               border border-white/25 ring-1 ring-green-light/20
               text-white text-2xl font-bold text-center
               hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-green-light
               transition-all duration-300"
      >
        Single Player
      </button>

      <button
        class="w-[80%] md:w-[30%] h-[20vh] flex items-center justify-center
               bg-white/15 backdrop-blur-md rounded-2xl shadow-xl
               border border-white/25 ring-1 ring-blue-light/20
               text-white text-2xl font-bold text-center
               hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-blue-light
               transition-all duration-300"
      >
        Multi Player
      </button>
    </div>
  </div>
</template>