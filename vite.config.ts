import { fileURLToPath, URL } from 'node:url'
import extend from 'extend'
import { defineConfig, loadEnv, type UserConfig } from 'vite'

// PostCSS 插件
import PostcssImport from 'postcss-import'
import Tailwindcss from 'tailwindcss'
import Autoprefixer from 'autoprefixer'

// Vite 插件
import Vue from '@vitejs/plugin-vue'
import VueJSX from '@vitejs/plugin-vue-jsx'
import Legacy from '@vitejs/plugin-legacy'
import Inject from '@rollup/plugin-inject'
import { createHtmlPlugin } from 'vite-plugin-html'
import { vitePluginFakeServer } from 'vite-plugin-fake-server'

// Theme
import {
  lightTheme,
  darkTheme,
  seedToken,
  genCSSVariable
} from './build/theme'

// Package
import pkg from './package.json'

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'
  const isServer = command === 'serve'
  const isMockEnabled = env.VITE_MOCK === 'true'

  const currentApi = () => {
    return !isMockEnabled
      ? isDev
        ? env.VITE_PROXY_API
        : env.VITE_API
      : ''
  }

  const currentRemote = () => {
    return isDev
      ? env.VITE_PROXY_REMOTE
      : env.VITE_REMOTE
  }

  const config = {
    define: {
      'import.meta.env.MOCK': isMockEnabled,
      'import.meta.env.API': JSON.stringify(currentApi()),
      'import.meta.env.REMOTE': JSON.stringify(currentRemote())
    },
    server: {
      hmr: true,
      open: true,
      host: true
    },
    resolve: {
      alias: {
        '~': resolve('./'),
        '@': resolve('./src')
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          relativeUrls: true,
          javascriptEnabled: true,
          charset: false
        }
      },
      modules: {
        auto: true,
        generateScopedName: `${isServer ? '[local]_' : ''}[hash:base64:8]`,
        globalModulePaths: [/\.module\.[sc|sa|le|c]ss$/i]
      },
      postcss: {
        plugins: [
          PostcssImport,
          Autoprefixer,
          Tailwindcss
        ]
      }
    },
    build: {
      minify: 'terser' as const,
      rollupOptions: {
        output: {
          manualChunks: {
            txjs: ['@txjs/bem', '@txjs/bool', '@txjs/make', '@txjs/shared', '@txjs/validator'],
            vue: ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },
    plugins: [
      Vue(),
      Legacy(),
      VueJSX({
        isCustomElement: (tag) => tag.startsWith('custom')
      }),
      Inject({
        $bem: '@txjs/bem',
        $http: resolve('./src/shared/http.ts')
      }),
      vitePluginFakeServer({
        logger: false,
        include: 'mock',
        infixName: false,
        enableDev: isMockEnabled,
        enableProd: isMockEnabled
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          tags: [
            {
              injectTo: 'head',
              tag: 'meta',
              attrs: {
                name: 'version',
                content: pkg.version
              }
            },
            {
              injectTo: 'head',
              tag: 'title',
              children: env.VITE_TITLE || pkg.name
            },
            {
              injectTo: 'head',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: `:root{${genCSSVariable(lightTheme)}} .dark{${genCSSVariable(darkTheme, false)}}`
            },
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'text/javascript'
              },
              children: `window.SEED_TOKEN = ${JSON.stringify(seedToken)}`
            }
          ]
        }
      })
    ]
  } as UserConfig

  if (env.VITE_PORT) {
    extend(true, config, {
      server: {
        port: env.VITE_PORT
      }
    })
  }

  if (env.VITE_PROXY_API && env.VITE_API) {
    extend(true, config, {
      server: {
        proxy: {
          [env.VITE_PROXY_API]: {
            target: env.VITE_API,
            changeOrigin: true,
            ws: true,
            rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_PROXY_API}`), '')
          }
        }
      }
    })
  }

  if (env.VITE_PROXY_REMOTE && env.VITE_REMOTE) {
    extend(true, config, {
      server: {
        proxy: {
          [env.VITE_PROXY_RESOURCE]: {
            target: env.VITE_RESOURCE,
            changeOrigin: true,
            ws: true,
            rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_PROXY_RESOURCE}`), '')
          }
        }
      }
    })
  }

  return config
})
