// Vue
import { defineComponent, computed } from 'vue'

// Component
import { Breadcrumb } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'

// Components utils
import { makeArrayProp } from '../_utils/props'

const [name, bem] = BEM('breadcrumb')

const breadcrumbProps = {
  items: makeArrayProp<string>()
}

export default defineComponent({
  name,

  props: breadcrumbProps,

  setup(props) {
    const routes = computed(() => {
      return [
        {breadcrumbName: 'home', path: ''},
        ...props.items.map((item) => ({
          breadcrumbName: $t(item),
          path: ''
        }))
      ]
    })

    return () => (
      <div class={bem()}>
        <Breadcrumb
          routes={routes.value}
          itemRender={({ route }) => {
            if (route.breadcrumbName === 'home') {
              return <HomeOutlined />
            }
            return <span>{route.breadcrumbName}</span>
          }}
        />
      </div>
    )
  }
})
