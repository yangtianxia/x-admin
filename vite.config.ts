import { fileURLToPath, URL } from 'node:url'
import extend from 'extend'
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import { isPlainObject } from '@txjs/bool'

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

import tinycolor2 from 'tinycolor2'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config'

// Package
import pkg from './package.json'

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

const colorToRgb = (input: string) => {
  const color = tinycolor2(input)
  if (color.isValid()) {
    return Object
      .values(color.toRgb())
      .slice(0, 3)
      .toString()
  }
}

const formatColor = (palettes: Record<string, any> = {}, prefix?: string) => {
  return Object
    .keys(palettes)
    .reduce(
      (obj, key) => {
        const value = palettes[key]
        if (isPlainObject(value)) {
          obj.push(...formatColor(value, key))
        }
        const rgb = colorToRgb(value)
        if (rgb) {
          const names = ['--color', prefix, key].filter(Boolean)
          obj.push(`${names.join('-')}:${rgb};`)
        }
        return obj
      }, [] as string[]
    )
    .join('')
}

export default defineConfig(({ mode, command }) => {
  const isServer = command === 'serve'
  const env = loadEnv(mode, process.cwd())
  const isMock = env.VITE_MOCK === 'enable'
  const tailwindFullConfig = resolveConfig(tailwindConfig)
  const colors = tailwindFullConfig.theme.colors

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
          tags: [
            {
              injectTo: 'head',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: `:root {${formatColor(colors)}}`
            },
            {
              injectTo: 'head',
              tag: 'meta',
              attrs: {
                name: 'author',
                content: `${pkg.author}`
              }
            },
            {
              injectTo: 'head',
              tag: 'meta',
              attrs: {
                name: 'version',
                content: `${pkg.version},${Date.now()}`
              }
            },
            {
              injectTo: 'head',
              tag: 'title',
              children: env['VITE_TITLE'] || ''
            },
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'text/javascript'
              },
              children: `window.themeColors = ${JSON.stringify(colors)}`
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
