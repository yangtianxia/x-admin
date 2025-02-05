// Vue
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  type ExtractPropTypes,
  type PropType
} from 'vue'

// Common
import Quill, { type QuillOptions } from 'quill'
import ImageResize from 'quill-resize-module'
import TableBetter from 'quill-table-better'
import { shallowMerge } from '@txjs/shared'
import { useExpose } from '@/hooks/expose'
import { bodyElement } from '@/shared/element'

// UI Icons
import uiIcons from './ui-icons'

// Quill Style
import 'quill/dist/quill.snow.css'
import 'quill-resize-module/dist/resize.css'
import 'quill-table-better/dist/quill-table-better.css'

if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize)
}

if (!Quill.imports['modules/tableBetter']) {
  Quill.register('modules/tableBetter', TableBetter)
}

shallowMerge(Quill.import('ui/icons') as Record<string, any>, uiIcons)

const getDefaultOptions = () => ({
  bounds: bodyElement,
  placeholder: '输入内容 ...',
  readOnly: false,
  modules: {
    table: false,
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { direction: 'rtl' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['table-better'],
      ['clean']
    ],
    imageResize: {
      embedTags: ['VIDEO', 'IFRAME'],
      tools: ['left', 'center', 'right', 'full']
    },
    tableBetter: {
      language: 'zh_CN',
      menus: ['column', 'row', 'merge', 'wrap', 'copy', 'delete'],
      toolbarTable: true
    },
    keyboard: {
      bindings: TableBetter.keyboardBindings
    }
  }
}) as QuillOptions

const [name, bem] = $bem('x-quill')

const quillProps = {
  content: String,
  value: String,
  disabled: Boolean,
  options: {
    type: Object as PropType<QuillOptions>,
    default: () => ({})
  },
  onReady: Function as PropType<(quill: Quill | null) => void>,
  onChange: Function as PropType<(event: {
    html: string | undefined
    text: string | undefined
    quill: Quill | null
  }) => void>,
  onInput: Function,
  onBlur: Function as PropType<(quill: Quill | null) => void>,
  onFocus: Function as PropType<(quill: Quill | null) => void>,
  'onUpdate:value': Function as PropType<(value: string | undefined) => void>
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

    const mergeOptions = (target: any, source: any) => {
      for (const key in source) {
        if (!target[key] || key !== 'modules') {
          target[key] = source[key]
        } else {
          mergeOptions(target[key], source[key])
        }
      }
      return target
    }

    let quill = null as Quill | null
    let options = {} as QuillOptions
    let content: string | undefined = props.value || props.content || ''

    const setContent = (newContent?: string) => {
      if (quill) {
        quill.root.innerHTML = newContent || ''
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
          ...options
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
          }
          let html = editorRef.value?.children[0].innerHTML
          const text = quill?.getText()
          if (html === '<p><br></p>') {
            html = ''
          }
          content = html
          emit('update:value', content)
          props.onChange?.({ html, text, quill })
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
      if (editorToolbar && editorToolbar.nodeType === 1 && editorToolbar.className.includes('ql-toolbar')) {
        editorToolbar.parentNode?.removeChild(editorToolbar)
      }
    })

    onUnmounted(quillDestroy)

    return () => (
      <div class={bem()}>
        <div ref={editorRef} />
      </div>
    )
  }
})
