import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api/auth': {
          target: env.VITE_AUTH_API || 'http://localhost:5185',
          changeOrigin: true,
          secure: false,
        },
        '/api/users': {
          target: env.VITE_AUTH_API || 'http://localhost:5185',
          changeOrigin: true,
          secure: false,
        },
        '/gamehub': {
          target: env.VITE_GAME_API || 'http://localhost:5170',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/api/game': {
          target: env.VITE_GAME_API || 'http://localhost:5170',
          changeOrigin: true,
          secure: false,
        },
        '/api/data': {
          target: env.VITE_DATA_API || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    preview: {
      proxy: {
        '/api/auth': {
          target: env.VITE_AUTH_API || 'http://localhost:5185',
          changeOrigin: true,
          secure: false,
        },
        '/api/users': {
          target: env.VITE_AUTH_API || 'http://localhost:5185',
          changeOrigin: true,
          secure: false,
        },
        '/gamehub': {
          target: env.VITE_GAME_API || 'http://localhost:5170',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/api/game': {
          target: env.VITE_GAME_API || 'http://localhost:5170',
          changeOrigin: true,
          secure: false,
        },
        '/api/data': {
          target: env.VITE_DATA_API || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
