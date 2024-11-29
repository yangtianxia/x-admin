import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import Tailwindcss from 'tailwindcss'
import Autoprefixer from 'autoprefixer'
import Vue from '@vitejs/plugin-vue'
import VueJSX from '@vitejs/plugin-vue-jsx'
import Legacy from '@vitejs/plugin-legacy'
import Inject from '@rollup/plugin-inject'
import { createHtmlPlugin } from 'vite-plugin-html'
import Ejs from 'ejs'
import { version } from './package.json'
import { token } from './theme.mjs'

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const env = loadEnv(mode, process.cwd())
  const theme = { token }
  return {
    server: {
      hmr: true,
      open: true,
      port: 6122,
      proxy: {
        [env.VITE_PROXY_API]: {
          target: env.VITE_API,
          changeOrigin: true,
          ws: true,
          rewrite: (path: string) => path.replace(
            new RegExp(`^${env.VITE_PROXY_API}`),
            ''
          )
        }
      }
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
            '@prefix': env.VITE_PREFIX
          }
        }
      },
      modules: {
        auto: true,
        generateScopedName: `${isDev ? '[local]_' : ''}[hash:base64:8]`,
        globalModulePaths: [/\.module\.[sc|sa|le|c]ss$/i]
      },
      postcss: {
        plugins: [
          Autoprefixer,
          Tailwindcss
        ]
      }
    },
    build: {
      minify: 'terser'
    },
    plugins: [
      Vue(),
      VueJSX({
        isCustomElement: (tag) => tag.startsWith('custom')
      }),
      Legacy(),
      Inject({
        $t: resolve('./src/locale/t.ts'),
        BEM: '@txjs/bem'
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
                content: `${version},${Date.now()}`
              }
            },
            {
              injectTo: 'head',
              tag: 'title',
              children: env['VITE_TITLE']
            },
            {
              injectTo: 'head',
              tag: 'style',
              attrs: {
                type: 'text/css'
              },
              children: Ejs.render(
                Ejs
                .fileLoader(resolve('node_modules/pollen-css/dist/pollen.css'))
                .toString()
                // 删除头部注释内容
                .replace(/\/\*([\s\S]*?)\*\//g, ''),
                {},
                { cache: false }
              )
            },
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'text/javascript'
              },
              children: `window.THEME = ${JSON.stringify(theme)}`
            }
          ]
        }
      })
    ]
  }
})
