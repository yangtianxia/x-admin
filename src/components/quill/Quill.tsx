import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  type ExtractPropTypes,
  type PropType,
} from 'vue'
import extend from 'extend'
import { shallowMerge } from '@txjs/shared'
import { useExpose } from '@/hooks/expose'
import { bodyElement } from '@/shared/element'

import { Form } from 'ant-design-vue'
import Quill, { type QuillOptions } from 'quill'
import ImageResize from 'quill-resize-module'
import TableBetter from 'quill-table-better'
import toolBarIcons from './toolbar-icons'
import 'quill/dist/quill.snow.css'
import 'quill-resize-module/dist/resize.css'
import 'quill-table-better/dist/quill-table-better.css'

Quill.register(
  {
    'modules/resize': ImageResize,
    'modules/table-better': TableBetter,
  },
  true
)

shallowMerge(Quill.import('ui/icons') as any, toolBarIcons)

const getDefaultOptions = () =>
  ({
    theme: 'snow',
    bounds: bodyElement,
    placeholder: '输入内容 ...',
    readOnly: false,
    modules: {
      table: false,
      toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { direction: 'rtl' },
        ],
        ['bold', 'italic', 'underline', 'strike'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['table-better'],
        ['clean'],
      ],
      resize: {
        embedTags: ['VIDEO', 'IFRAME'],
        tools: ['left', 'center', 'right', 'full'],
      },
      'table-better': {
        language: 'zh_CN',
        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'delete'],
        toolbarTable: true,
      },
      keyboard: {
        bindings: TableBetter.keyboardBindings,
      },
    },
  }) as QuillOptions

const [name, bem] = $bem('x-quill')

const quillProps = {
  content: String,
  value: String,
  disabled: Boolean,
  options: {
    type: Object as PropType<QuillOptions>,
    default: () => ({}),
  },
  onReady: Function as PropType<(quill: Quill | null) => void>,
  onChange: Function as PropType<
    (event: {
      html: string | undefined
      text: string | undefined
      quill: Quill | null
    }) => void
  >,
  onInput: Function,
  onBlur: Function as PropType<(quill: Quill | null) => void>,
  onFocus: Function as PropType<(quill: Quill | null) => void>,
  'onUpdate:value': Function as PropType<(value: string | undefined) => void>,
}

export type QuillProps = ExtractPropTypes<typeof quillProps>

export type QuillProvide = {
  quill: Quill
}

export default defineComponent({
  name,
  props: quillProps,
  setup(props, { emit }) {
    const editorRef = ref<HTMLDivElement>()

    const formItemContext = Form.useInjectFormItemContext()

    const mergeOptions = (target: any, source: any) => {
      return extend(true, {}, target, source)
    }

    let quill = null as Quill | null
    let options = {} as QuillOptions
    let content: string | undefined = props.value || props.content || ''

    const setContent = (html?: string) => {
      if (quill) {
        quill.setContents([])

        if (!html) {
          quill.setText('')
          return
        }

        const delta = quill.clipboard.convert({ html })
        quill.updateContents(delta, Quill.sources.USER)
      }
    }

    const initialize = () => {
      if (editorRef.value) {
        // Quill Options
        options = mergeOptions(getDefaultOptions(), props.options)
        options.readOnly = props.disabled ? true : false

        // Quill Instance
        quill = new Quill(editorRef.value, {
          theme: 'snow',
          ...options,
        })

        // Set editor content
        if (content) {
          setContent(content)
        }

        // Disabled
        if (props.disabled) {
          quill.enable(false)
        }

        quill.on('selection-change', (range) => {
          if (!range) {
            props.onBlur?.(quill)
          } else {
            props.onFocus?.(quill)
          }
        })

        quill.on('text-change', () => {
          if (props.disabled) {
            quill?.enable(false)
            return
          }

          const html = editorRef.value?.children[0].innerHTML
          const text = quill?.getText()
          content = html === '<p><br></p>' ? '' : html
          emit('update:value', content)
          formItemContext.onFieldChange()
          props.onChange?.({ html: content, text, quill })
        })

        props.onReady?.(quill)
      }
    }

    const quillDestroy = () => {
      quill = null
    }

    watch(
      () => props.disabled,
      (value) => {
        if (quill) {
          quill.enable(value)
        }
      }
    )

    watch(
      () => props.value,
      (value) => {
        if (quill) {
          if (value && value !== content) {
            content = value
            setContent(value)
          } else if (!value) {
            quill.setText('')
          }
        }
      }
    )

    watch(
      () => props.content,
      (value) => {
        if (quill) {
          if (value && value !== content) {
            content = value
            setContent(value)
          } else if (!value) {
            quill.setText('')
          }
        }
      }
    )

    useExpose({ quill })

    onMounted(initialize)

    onBeforeUnmount(() => {
      const editorToolbar = editorRef.value?.previousSibling as HTMLDivElement
      if (
        editorToolbar &&
        editorToolbar.nodeType === 1 &&
        editorToolbar.className.includes('ql-toolbar')
      ) {
        editorToolbar.parentNode?.removeChild(editorToolbar)
      }
    })

    onUnmounted(quillDestroy)

    return () => (
      <div class={bem()}>
        <div ref={editorRef} />
      </div>
    )
  },
})
