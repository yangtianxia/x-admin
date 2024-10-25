import type { TableColumnType } from 'ant-design-vue'

interface CustomTableColunmType<T = any> extends TableColumnType<T> {
  onFilter?: (value: any, record: T) => boolean
  onFilterDropdownVisibleChange?: (visible: boolean) => void
}

export const useColumns = <T = any>(columns:  CustomTableColunmType<T>[]) => {
  return columns
}
