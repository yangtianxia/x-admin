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
import { LightTheme, DarkTheme, seedToken, genCSSVariable } from './build/theme'

// Package
import { version } from './package.json'

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const isServer = command === 'serve'
  const isMockEnabled = env.VITE_MOCK === 'true'

  const config = {
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
          charset: false,
          modifyVars: {
            '@prefix': 'x'
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
      minify: 'terser' as const,
      rollupOptions: {
        output: {
          manualChunks: {
            txjs: ['@txjs/bem', '@txjs/bool', '@txjs/make', '@txjs/shared', '@txjs/validator'],
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n']
          }
        }
      }
    },
    plugins: [
      Vue(),
      VueJSX({
        isCustomElement: (tag) => tag.startsWith('custom')
      }),
      Legacy(),
      Inject({
        $t: resolve('./src/locale/t.ts'),
        $bem: '@txjs/bem',
        $request: resolve('./src/shared/request.ts')
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
          data: { version },
          tags: [
            {
              injectTo: 'head',
              tag: 'meta',
              attrs: {
                name: 'theme-color',
                content: LightTheme.colorBgContainer,
                media: '(prefers-color-scheme: light)'
              }
            },
            {
              injectTo: 'head',
              tag: 'meta',
              attrs: {
                name: 'theme-color',
                content: DarkTheme.colorBgContainer,
                media: '(prefers-color-scheme: dark)'
              }
            },
            {
              injectTo: 'head',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: `:root { ${genCSSVariable(LightTheme)} }`
            },
            {
              injectTo: 'head',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: `.dark { ${genCSSVariable(DarkTheme, false)} }`
            },
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'text/javascript'
              },
              children: `window.seedToken = ${JSON.stringify(seedToken)}`
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
