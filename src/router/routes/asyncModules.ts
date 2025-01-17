import type { Component } from './types'

const PATH_REGEX = new RegExp(`/(views/(login|not-found|forbidden)|components)/`, 'i')

const modules = import.meta.glob('@/views/**/*.tsx')

export const asyncRouteModules = Object
  .entries(modules)
  .reduce(
    (routes, [url, component]) => {
      if (!PATH_REGEX.test(url)) {
        const path = url
          .replace('/src/views/', '')
          .replace('.tsx', '')
        routes[path] = component
      }
      return routes
    }, {} as Record<string, Component>
  )
