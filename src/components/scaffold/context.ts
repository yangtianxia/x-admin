import { inject, watch } from 'vue'
import { createInjectionKey } from '../_utils/basic'

export const SCAFFOLD_LOADING_KEY =
  createInjectionKey<() => boolean>('scaffold-loading')

export const onScaffoldLoaded = (callback: UnknownCallback<boolean>) => {
  const loading = inject(SCAFFOLD_LOADING_KEY, null)

  if (loading) {
    watch(loading, (value) => callback(value))
  }
}
