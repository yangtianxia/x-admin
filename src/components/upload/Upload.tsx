// Vue
import {
  defineComponent,
  ref,
  computed,
  shallowRef,
  watch,
  nextTick,
  onBeforeMount,
  onMounted,
  onUnmounted,
  type PropType
} from 'vue'

// Common
import debounce from 'debounce'
import {
  omit,
  shallowMerge,
  toArray
} from '@txjs/shared'
import { isNil, isPlainObject } from '@txjs/bool'
import { getToken } from '@/shared/auth'
import { openWindow } from '@/shared/open-window'
import { REQUEST_TOKEN_KEY } from '@/constant/http'

// Components
import { Icon } from '../icon'
import { uploadProps } from 'ant-design-vue/es/upload/interface'
import {
  Form,
  Upload,
  ImagePreviewGroup,
  Image,
  notification,
  type UploadProps
} from 'ant-design-vue'

// Component utils
import { makeNumberProp, makeStringProp } from '../_utils/props'
import { formatAccept, fileToObj } from './utils'

// Types
import type {
  UploadType,
  UploadResponse,
  UploadFile
} from './types'

const [name, bem] = $bem('x-upload')

export const uploadSharedProps = shallowMerge({}, uploadProps(), {
  maxCount: makeNumberProp(1),
  maxSize: makeNumberProp(Number.MAX_VALUE),
  urls: [String, Array] as PropType<string | string[]>,
  data: Object as PropType<Record<string, any>>,
  customRequest: Function as PropType<UploadProps['customRequest']>,
  beforeUpload: Function as PropType<UploadProps['beforeUpload']>,
  formatter: Function as PropType<<T = any>(file: UploadFile<UploadResponse>[]) => T>,
  accept: makeStringProp('imgage/gif,image/png,image/pjpeg,image/jpeg,image/webp,image/gif'),
  listType: makeStringProp<UploadProps['listType']>('picture-card'),
  type: makeStringProp<UploadType>('image'),
  action: {
    type: [String, Function] as PropType<UploadProps['action']>,
    default: `${import.meta.env.API}/upload`
  },
  onRemove: Function as PropType<(file: UploadFile) => void>,
  'onUpdate:fileList': Function as PropType<(fileList: UploadFile) => void>
})

const uploadPropsKeys = [
  'maxCount',
  'maxSize',
  'type',
  'beforeUpload',
  'customRequest',
  'urls'
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
    const headers = shallowRef<NonNullable<UploadProps['headers']>>(props.headers || {})

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
    const notifyHandler = debounce((message: string) => notification.error({ message }), 1000)

    let handleTimer: any

    const onTimerClear = () => {
      clearTimeout(handleTimer)
      handleTimer = null
    }

    const checkUpload = () => {
      nextTick(() => {
        if (uploadedList.size < props.maxCount) {
          onTimerClear()
          handleTimer = setTimeout(() => {
            canUpload.value = true
          })
        } else {
          canUpload.value = false
        }
      })
    }

    const checkFileType = (file: UploadFile) => {
      if (!file.type) {
        return false
      }

      const fileTypes = formatAccept(props.accept)

      // 匹配前缀符合的类型
      const foundAt = fileTypes.findIndex(([type]) => file.type!.startsWith(type))

      if (foundAt === -1) {
        return false
      }

      const suffix = fileTypes[foundAt][1]

      // 后缀为 `*` 或 文件类型后缀匹配
      return suffix === '*' || file.type.endsWith(suffix)
    }

    const beforeRead = (file: UploadFile) => [
      {
        validator: () => checkFileType(file),
        message: '选择文件类型不支持'
      },
      {
        validator: () => Boolean(file.size) && (file.size! / 1024) < props.maxSize,
        message: `文件大小必须 ≤ ${props.maxSize >= 1024 ? props.maxSize / 1024 + 'MB' : props.maxSize + 'KB'}`
      },
      {
        validator: () => uploadedList.size + 1 <= props.maxCount,
        message: `上传数量超过限制，最多只能上传 ${props.maxCount} 个`
      }
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
      files = files.reduce(
        (acc, file) => {
          if (uploadErrorList.has(file.uid)) {
            // 删除已上传失败文件
            if (uploadedList.has(file.uid)) {
              uploadedList.delete(file.uid)
            }
            uploadErrorList.delete(file.uid)
          } else {
            if (isNil(file.remote)
                && file.status === 'done'
                && isPlainObject(file.response)
                && file.response.code === 200) {
              file.remote = file.response?.data?.path
            }
            acc.push(file)
            uploadedList.set(file.uid, file)
          }
          return acc
        }, [] as UploadFile<UploadResponse>[]
      )

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
      previewCurrent.value = fileList.value.findIndex((el) => el.uid === file.uid)
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
          uploadedList.clear()
          checkUpload()
        }
      }
    )

    onBeforeMount(() => {
      if (props.urls) {
        const values = toArray(props.urls).map(fileToObj)
        updateFileList(values)
      }

      if (!headers.value[REQUEST_TOKEN_KEY]) {
        headers.value[REQUEST_TOKEN_KEY] = getToken()!
      }
    })

    onMounted(() => {
      if (!props.fileList?.length) {
        canUpload.value = true
      }
    })

    onUnmounted(onTimerClear)

    const renderUpload = () => (
      <Upload
        {...{
          ...attrs,
          ...omit(props, uploadPropsKeys),
          'onUpdate:fileList': updateFileList
        }}
        class={bem({hidden: !canUpload.value})}
        locale={{uploading: '正在上传'}}
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
        removeIcon={isPictureCard.value ? () => (
          <span class={bem('delete')}>
            <Icon
              type="CloseSmall"
              strokeWidth={5}
            />
          </span>
        ) : undefined}
      >
        {canUpload.value ? (
          <span
            title="选择文件"
            id={formItemContext.id.value}
          >
            {slots.default?.() || (
              <span class={bem('button')}>
                <Icon
                  type="Plus"
                  class={bem('button-icon')}
                />
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
            onVisibleChange: setPreviewVisible
          }}
        >
          {renderUpload()}
          {fileList.value.map((file) => (
            <Image
              class="hidden"
              key={file.uid}
              preview={{src: file.remote || file.thumbUrl}}
            />
          ))}
        </ImagePreviewGroup>
      )
    }

    return () => renderUpload()
  }
})
