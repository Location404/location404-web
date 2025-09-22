<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-light via-gray-600 to-green-medium flex flex-col gap-16">
    <Toolbar />

    <main class="flex-grow overflow-y-auto h-full w-full flex items-center justify-center">
        <PlayForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import Toolbar from '@/components/ToolbarForm.vue'
import PlayForm from '@/components/PlayForm.vue'
</script>