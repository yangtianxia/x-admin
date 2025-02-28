import {
  defineComponent,
  ref,
  computed,
  shallowRef,
  watch,
  nextTick,
  onBeforeMount,
  onUnmounted,
  type PropType,
} from 'vue'
import debounce from 'debounce'
import { omit, shallowMerge, toArray } from '@txjs/shared'
import { isNil, isPlainObject, isEqual } from '@txjs/bool'
import { getToken } from '@/shared/auth'
import { openWindow } from '@/shared/open-window'
import { REQUEST_TOKEN_KEY } from '@/constant/http'

import {
  Form,
  Upload,
  ImagePreviewGroup,
  Image,
  notification,
  type UploadProps,
} from 'ant-design-vue'
import { uploadProps } from 'ant-design-vue/es/upload/interface'
import { Icon } from '../icon'
import { makeNumberProp, makeStringProp } from '../_utils/props'

import { fileToObj } from './utils'
import type { UploadType, UploadResponse, UploadFile } from './types'

const [name, bem] = $bem('x-upload')

export const uploadSharedProps = shallowMerge({}, uploadProps(), {
  action: {
    type: [String, Function] as PropType<UploadProps['action']>,
    default: `${import.meta.env.API}/upload`,
  },
  type: makeStringProp<UploadType>('image'),
  maxCount: makeNumberProp(1),
  maxSize: makeNumberProp(Number.MAX_VALUE),
  urls: [String, Array] as PropType<string | string[]>,
  data: Object as PropType<Record<string, any>>,
  customRequest: Function as PropType<UploadProps['customRequest']>,
  beforeUpload: Function as PropType<UploadProps['beforeUpload']>,
  formatter: Function as PropType<
    <T = any>(file: UploadFile<UploadResponse>[]) => T
  >,
  accept: makeStringProp(
    'image/gif,image/png,image/pjpeg,image/jpeg,image/webp,image/gif'
  ),
  listType: makeStringProp<UploadProps['listType']>('picture-card'),
  onRemove: Function as PropType<(file: UploadFile) => void>,
  'onUpdate:fileList': Function as PropType<(fileList: UploadFile) => void>,
})

const uploadPropsKeys = [
  'maxCount',
  'maxSize',
  'type',
  'beforeUpload',
  'customRequest',
  'urls',
] as const

export default defineComponent({
  name,
  inheritAttrs: false,
  props: uploadSharedProps,
  setup(props, { slots, attrs, emit }) {
    const canUpload = ref(false)
    const previewUrl = ref<string>()
    const previewCurrent = ref<number>(0)
    const previewVisible = ref(false)
    const fileList = ref<UploadFile[]>([])
    const headers = shallowRef<NonNullable<UploadProps['headers']>>(
      props.headers || {}
    )

    const isPictureCard = computed(() => props.listType === 'picture-card')

    const isImageType = computed(() => props.type === 'image')

    const previewIcon = computed(() => {
      if (props.type === 'image') {
        return 'ZoomIn'
      }
      if (props.type === 'video') {
        return 'PlayOne'
      }
      return 'PreviewOpen'
    })

    const uploadedList = new Map<string, UploadFile>()
    const uploadErrorList = new Map<string, UploadFile>()

    const formItemContext = Form.useInjectFormItemContext()
    const notifyHandler = debounce(
      (message: string) => notification.error({ message }),
      1000
    )

    let timer: any

    const clearTimer = () => {
      clearTimeout(timer)
      timer = null
    }

    const checkUpload = () => {
      nextTick(() => {
        if (uploadedList.size < props.maxCount) {
          clearTimer()
          timer = setTimeout(() => {
            canUpload.value = true
          }, 1)
        } else {
          canUpload.value = false
        }
      })
    }

    const resetUpload = () => {
      previewUrl.value = undefined
      previewCurrent.value = 0
      uploadedList.clear()
      uploadErrorList.clear()
      fileList.value = []
    }

    const validateFileType = (file: UploadFile) => {
      if (!file.type) {
        return false
      }
      const fileType = file.type.toLowerCase()
      const allowedPatterns = props.accept.split(',').map((pattern) => {
        const trimmed = pattern.trim().toLowerCase()
        const escaped = trimmed
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')
        return new RegExp(`^${escaped}$`, 'i')
      })
      return allowedPatterns.some((regex) => regex.test(fileType))
    }

    const beforeRead = (file: UploadFile) =>
      [
        {
          validator: () => validateFileType(file),
          message: '选择文件类型不支持',
        },
        {
          validator: () =>
            Boolean(file.size) && file.size! / 1024 < props.maxSize,
          message: `文件大小必须 ≤ ${props.maxSize >= 1024 ? props.maxSize / 1024 + 'MB' : props.maxSize + 'KB'}`,
        },
        {
          validator: () => uploadedList.size + 1 <= props.maxCount,
          message: `上传数量超过限制，最多只能上传 ${props.maxCount} 个`,
        },
      ].find((item) => !item.validator())

    const beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {
      const result = beforeRead(file)

      // 多文件上传
      if (fileList.length > 1) {
        fileList.forEach((file) => {
          if (beforeRead(file) && uploadedList.has(file.uid)) {
            uploadErrorList.set(file.uid, file)
          }
        })
      }
      // 单文件上传
      else if (result) {
        uploadErrorList.set(file.uid, file)
      }

      if (!result) {
        uploadedList.set(file.uid, file)
        checkUpload()
      } else {
        notifyHandler(result.message)
        return false
      }
    }

    const updateFileList = (files: UploadFile<UploadResponse>[]) => {
      // 过滤上传失败文件
      files = files.reduce((acc, file) => {
        if (uploadErrorList.has(file.uid)) {
          // 删除已上传失败文件
          if (uploadedList.has(file.uid)) {
            uploadedList.delete(file.uid)
          }
          uploadErrorList.delete(file.uid)
        } else {
          if (
            isNil(file.remote) &&
            file.status === 'done' &&
            isPlainObject(file.response) &&
            file.response.code === 200
          ) {
            file.remote = file.response?.data?.path
          }
          acc.push(file)
          uploadedList.set(file.uid, file)
        }
        return acc
      }, [] as UploadFile<UploadResponse>[])

      checkUpload()
      fileList.value = files
      emit('update:fileList', files)
      formItemContext.onFieldChange()
    }

    const setPreviewVisible = (value: boolean) => {
      previewVisible.value = value
    }

    const onRemove = (file: UploadFile) => {
      uploadedList.delete(file.uid)
      props.onRemove?.(file)
    }

    const onPreview = (file: UploadFile) => {
      previewUrl.value = file.remote || file.thumbUrl || file.preview
      previewCurrent.value = fileList.value.findIndex(
        (el) => el.uid === file.uid
      )
      setPreviewVisible(true)
    }

    const onPreviewFile = (file: UploadFile) => {
      const url = file.remote || file.thumbUrl || file.preview
      if (url) {
        openWindow(url)
      }
    }

    watch(
      () => props.fileList,
      (values) => {
        if (!values?.length) {
          resetUpload()
          checkUpload()
        }
      },
      { immediate: true }
    )

    watch(
      () => props.urls,
      (value, oldValue) => {
        if (value && !isEqual(value, oldValue)) {
          const values = toArray(value).map(fileToObj)
          updateFileList(values)
        }
      },
      { immediate: true }
    )

    onBeforeMount(() => {
      if (!headers.value[REQUEST_TOKEN_KEY]) {
        headers.value[REQUEST_TOKEN_KEY] = getToken()!
      }
    })

    onUnmounted(clearTimer)

    const renderUpload = () => (
      <Upload
        {...{
          ...attrs,
          ...omit(props, uploadPropsKeys),
          'onUpdate:fileList': updateFileList,
        }}
        class={bem({ hidden: !canUpload.value })}
        locale={{ uploading: '正在上传' }}
        fileList={fileList.value}
        headers={headers.value}
        beforeUpload={props.beforeUpload ?? beforeUpload}
        onRemove={onRemove}
        onPreview={isImageType.value ? onPreview : onPreviewFile}
        previewFile={async (file) => URL.createObjectURL(file)}
        previewIcon={() => (
          <span class={bem('preview')}>
            <Icon type={previewIcon.value} />
          </span>
        )}
        removeIcon={
          isPictureCard.value
            ? () => (
                <span class={bem('delete')}>
                  <Icon type="CloseSmall" strokeWidth={5} />
                </span>
              )
            : undefined
        }
      >
        {canUpload.value ? (
          <span title="选择文件" id={formItemContext.id.value}>
            {slots.default?.() || (
              <span class={bem('button')}>
                <Icon type="Plus" class={bem('button-icon')} />
              </span>
            )}
          </span>
        ) : null}
      </Upload>
    )

    if (isImageType.value) {
      return () => (
        <ImagePreviewGroup
          preview={{
            current: previewCurrent.value,
            src: previewUrl.value,
            visible: previewVisible.value,
            onVisibleChange: setPreviewVisible,
          }}
        >
          {renderUpload()}
          {fileList.value.map((file) => (
            <Image
              class="hidden"
              key={file.uid}
              preview={{ src: file.remote || file.thumbUrl }}
            />
          ))}
        </ImagePreviewGroup>
      )
    }

    return () => renderUpload()
  },
})
