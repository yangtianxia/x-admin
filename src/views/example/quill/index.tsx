// Vue
import { defineComponent, ref } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'
import { Quill } from '@/components/quill'

export default defineComponent({
  name: 'ExampleQuillPage',
  setup() {
    const content = ref('<h1>标题一</h1>')

    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body>
          <div class="space-y-4">
            <Quill
              v-model:value={content.value}
              onChange={(event) => {
                console.log(event)
              }}
            />
            <Quill disabled />
          </div>
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
