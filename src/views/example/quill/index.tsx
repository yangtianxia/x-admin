// Vue
import { defineComponent, ref } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'
import { Quill } from '@/components/quill'

export default defineComponent({
  name: 'ExampleQuillPage',
  setup() {
    const content = ref('<h1>标题一</h1><p><br></p><table class="ql-table-better"><temporary class="ql-table-temporary" data-class="ql-table-better"><br></temporary><tbody><tr><td data-row="row-eqjm" width="72"><p class="ql-table-block" data-cell="cell-5h51"><br></p></td><td data-row="row-eqjm" width="72"><p class="ql-table-block" data-cell="cell-nx14"><br></p></td><td data-row="row-eqjm" width="72"><p class="ql-table-block" data-cell="cell-m7m8"><br></p></td><td data-row="row-eqjm" width="72"><p class="ql-table-block" data-cell="cell-aaqn"><br></p></td><td data-row="row-eqjm" width="72"><p class="ql-table-block" data-cell="cell-kup7"><br></p></td></tr><tr><td data-row="row-fpli" width="72"><p class="ql-table-block" data-cell="cell-per0"><br></p></td><td data-row="row-fpli" width="72"><p class="ql-table-block" data-cell="cell-7h4u"><br></p></td><td data-row="row-fpli" width="72"><p class="ql-table-block" data-cell="cell-aoo8"><br></p></td><td data-row="row-fpli" width="72"><p class="ql-table-block" data-cell="cell-j1es"><br></p></td><td data-row="row-fpli" width="72"><p class="ql-table-block" data-cell="cell-sas0"><br></p></td></tr><tr><td data-row="row-h377" width="72"><p class="ql-table-block" data-cell="cell-3acw"><br></p></td><td data-row="row-h377" width="72"><p class="ql-table-block" data-cell="cell-qvrd"><br></p></td><td data-row="row-h377" width="72"><p class="ql-table-block" data-cell="cell-zr8i"><br></p></td><td data-row="row-h377" width="72"><p class="ql-table-block" data-cell="cell-w0m9"><br></p></td><td data-row="row-h377" width="72"><p class="ql-table-block" data-cell="cell-9opq"><br></p></td></tr></tbody></table><p><br></p>')

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
