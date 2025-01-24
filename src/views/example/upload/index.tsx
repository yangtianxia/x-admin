// Vue
import { defineComponent, ref } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'
import { Upload } from '@/components/upload'

export default defineComponent({
  name: 'ExampleUploadPage',
  setup() {
    const fileList = ref([])
    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body>
          <Upload
            v-model:fileList={fileList.value}
            maxCount={5}
            urls={['https://gips0.baidu.com/it/u=3093851010,2626068568&fm=3042&app=3042&f=JPEG&wm=1,huayi,0,0,13,9&wmo=0,0&w=1024&h=1024']}
          />
          <Upload
            v-model:fileList={fileList.value}
            type="file"
            urls={['https://gips0.baidu.com/it/u=3093851010,2626068568&fm=3042&app=3042&f=JPEG&wm=1,huayi,0,0,13,9&wmo=0,0&w=1024&h=1024']}
          />
          <Upload
            listType="picture"
            urls={['https://gips0.baidu.com/it/u=3093851010,2626068568&fm=3042&app=3042&f=JPEG&wm=1,huayi,0,0,13,9&wmo=0,0&w=1024&h=1024']}
          />
          <Upload
            listType="picture"
            type="file"
            urls={['https://gips0.baidu.com/it/u=3093851010,2626068568&fm=3042&app=3042&f=JPEG&wm=1,huayi,0,0,13,9&wmo=0,0&w=1024&h=1024']}
          />
          <Upload
            listType="text"
            type="file"
            urls={['https://gips0.baidu.com/it/u=3093851010,2626068568&fm=3042&app=3042&f=JPEG&wm=1,huayi,0,0,13,9&wmo=0,0&w=1024&h=1024']}
          />
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
