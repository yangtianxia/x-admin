// Types
import type { ImageFit, ImagePosition } from './types'

// Vue
import {
  defineComponent,
  ref,
  computed,
  watch,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type PropType,
  type CSSProperties,
  type ImgHTMLAttributes,
  type Slot,
  type ExtractPropTypes
} from 'vue'

// Common
import { notNil } from '@txjs/bool'

// Component utils
import { inBrowser } from '../_utils/basic'
import { truthProp, numericProp } from '../_utils/props'
import { addUnit, getSizeStyle } from '../_utils/style'

const [name, bem] = BEM('image')

const imageProps = {
  src: String,
  alt: String,
  round: Boolean,
  full: Boolean,
  block: Boolean,
  size: numericProp,
  width: numericProp,
  height: numericProp,
  radius: numericProp,
  lazyLoad: truthProp,
  showError: truthProp,
  showLoading: truthProp,
  fit: String as PropType<ImageFit>,
  position: String as PropType<ImagePosition>,
  crossorigin: String as PropType<ImgHTMLAttributes['crossorigin']>,
  referrerpolicy: String as PropType<ImgHTMLAttributes['referrerpolicy']>,
  onLoad: Function as PropType<(event: Event) => void>,
  onError: Function as PropType<(event?: Event) => void>,
}

export type ImageProps = ExtractPropTypes<typeof imageProps>

export default defineComponent({
  name,
  props: imageProps,
  setup(props, { slots }) {
    const error = ref(false)
    const loading = ref(true)
    const imgRef = ref<HTMLImageElement>()

    const { $Lazyload } = getCurrentInstance()!.proxy! as any

    const style = computed(() => {
      let result = {} as CSSProperties

      if (notNil(props.size)) {
        result = getSizeStyle(props.size)!
      } else {
        result.width = addUnit(props.width)
        result.height = addUnit(props.height)
      }

      if (notNil(props.radius)) {
        result.overflow = 'hidden'
        result.borderRadius = addUnit(props.radius)
      }

      return result
    })

    const onLoad = (event: Event) => {
      loading.value = false
      props.onLoad?.(event)
    }

    const triggerLoad = () => {
      const loadEvent = new Event('load')
      Object.defineProperty(loadEvent, 'target', {
        value: imgRef.value,
        enumerable: true,
      })
      onLoad(loadEvent)
    }

    const onError = (event?: Event) => {
      error.value = true
      loading.value = false
      props.onError?.(event)
    }

    const onLazyLoaded = (event: Record<'el', HTMLElement>) => {
      const check = () => {
        if (event.el === imgRef.value && loading.value) {
          triggerLoad()
        }
      }
      if (imgRef.value) {
        check()
      } else {
        nextTick(check)
      }
    }

    const onLazyLoadError = (event: Record<'el', HTMLElement>) => {
      if (event.el === imgRef.value && !error.value) {
        onError()
      }
    }

    watch(
      () => props.src,
      () => {
        error.value = false
        loading.value = true
      }
    )

    if ($Lazyload && inBrowser) {
      $Lazyload.$on('loaded', onLazyLoaded)
      $Lazyload.$on('error', onLazyLoadError)

      onBeforeUnmount(() => {
        $Lazyload.$off('loaded', onLazyLoaded)
        $Lazyload.$off('error', onLazyLoadError)
      })
    }

    onMounted(() => {
      nextTick(() => {
        if (imgRef.value?.complete && !props.lazyLoad) {
          triggerLoad()
        }
      })
    })

    const renderIcon = (className: unknown, slot?: Slot) => {
      return slot?.() ?? (
        <div class={className}></div>
      )
    }

    const renderPlaceholder = () => {
      if (loading.value && props.showLoading) {
        return (
          <div class={bem('loading')}>
            {renderIcon(bem('loading-icon', slots.loading))}
          </div>
        )
      }

      if (error.value) {
        return (
          <div class={bem('error')}>
            {renderIcon(bem('error-icon'), slots.error)}
          </div>
        )
      }
    }

    const renderImage = () => {
      if (error.value || !props.src) return

      const attrs = {
        alt: props.alt,
        class: bem('img'),
        style: {
          objectFit: props.fit,
          objectPosition: props.position,
        },
        crossorigin: props.crossorigin,
        referrerpolicy: props.referrerpolicy,
      }

      if ($Lazyload && props.lazyLoad) {
        return (
          <img
            {...attrs}
            ref={imgRef}
            v-lazy={props.src}
          />
        )
      }

      return (
        <img
          {...attrs}
          ref={imgRef}
          src={props.src}
          onLoad={onLoad}
          onError={onError}
        />
      )
    }

    return () => {
      const { round, block, full } = props
      return (
        <div
          class={bem({ round, block, full })}
          style={style.value}
        >
          {renderImage()}
          {renderPlaceholder()}
          {slots.default?.()}
        </div>
      )
    }
  }
})
