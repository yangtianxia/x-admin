import { ref, reactive } from 'vue'
import { shallowMerge } from '@txjs/shared'
import type { PaginationProps } from 'ant-design-vue'

type Pagination = Pick<PaginationProps,
  | 'current'
  | 'defaultPageSize'
  | 'disabled'
  | 'hideOnSinglePage'
  | 'itemRender'
  | 'pageSize'
  | 'pageSizeOptions'
  | 'responsive'
  | 'showLessItems'
  | 'showQuickJumper'
  | 'showSizeChanger'
  | 'showTotal'
  | 'simple'
  | 'size'
  | 'total'
>

const defaultPagination = () => ({
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
})

export const usePagination = (options?: Pagination) => {
  options ??= {}
  return reactive(shallowMerge(defaultPagination(), options))
}

export const useCurrentPage = (page?: number) => {
  page ??= 1

  const current = ref(page)
  const oldValue = ref<number>(page)

  const change = (value: number) => {
    oldValue.value = current.value
    current.value = value
  }

  const reset = () => {
    current.value = page
    oldValue.value = page
  }

  const recover = () => {
    current.value = oldValue.value
  }

  return {
    change,
    reset,
    recover,
    get value() {
      return current.value
    },
    get oldValue() {
      return oldValue.value
    }
  }
}
