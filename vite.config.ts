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
import { viteMockServe } from 'vite-plugin-mock'

// Tailwindcss
import { seedToken } from './tailwind.config'

// Package
import { version } from './package.json'

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const isServer = command === 'serve'
  const isMock = env.VITE_MOCK === 'enable'

  const config = {
    server: {
      hmr: true,
      open: true
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
          charset: false,
          modifyVars: {
            '@prefix': env.VITE_PREFIX || 'x'
          }
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
      minify: 'terser' as const
    },
    plugins: [
      Vue(),
      viteMockServe({
        enable: isMock,
        logger: true
      }),
      VueJSX({
        isCustomElement: (tag) => tag.startsWith('custom')
      }),
      Legacy(),
      Inject({
        $t: resolve('./src/locale/t.ts'),
        $fetch: resolve('./src/shared/fetch.ts'),
        $bem: '@txjs/bem'
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: { version },
          tags: [
            {
              injectTo: 'head-prepend',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: `:root { --color-primary: ${seedToken.colorPrimary} }`
            },
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'text/javascript'
              },
              children: `window.$seedToken = ${JSON.stringify(seedToken)}`
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

  return config
})
