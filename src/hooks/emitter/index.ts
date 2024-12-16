import mitt from 'mitt'
import { onUnmounted } from 'vue'

type EventName = string | symbol

const emitter = mitt()

export const useEmitter = () => {
  const eventNames = [] as EventName[]
  const off = emitter.off
  const on = (eventName: EventName, listener: UnknownCallback<any>) => {
    emitter.on(eventName, listener)
    eventNames.push(eventName)
  }
  onUnmounted(() => {
    for (const key in eventNames) {
      off(key)
    }
  })
  return {
    on,
    off,
    emit: emitter.emit,
    all: emitter.all,
  }
}
