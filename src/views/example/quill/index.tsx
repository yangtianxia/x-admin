import { defineComponent, ref } from 'vue'

import { Scaffold } from '@/components/scaffold'
import { Quill } from '@/components/quill'

export default defineComponent({
  name: 'ExampleQuillPage',
  setup() {
    const content = ref(`<table style="width: 640px" class="ql-table-better">
      <tbody>
        <tr>
          <td data-row="row-kbbt" width="72" class="">
            <p class="ql-table-block" data-cell="cell-pqbh">1</p>
          </td>
          <td data-row="row-kbbt" width="72" style="background-color: #4d99e6; " class="">
            <p class="ql-table-block" data-cell="cell-6vwb">2</p>
          </td>
          <td data-row="row-kbbt" width="72" style="background-color: #4d99e6; " class="">
            <p class="ql-table-block" data-cell="cell-sbdd">3</p>
          </td>
        </tr>
        <tr>
          <td data-row="row-j9rd" width="72" class="">
            <p class="ql-table-block" data-cell="cell-hbqz">4</p>
          </td>
          <td data-row="row-j9rd" width="72" class="">
            <p class="ql-table-block" data-cell="cell-kgtt">5</p>
          </td>
          <td data-row="row-j9rd" width="72" class="">
            <p class="ql-table-block" data-cell="cell-2pu4">6</p>
          </td>
        </tr>
        <tr>
          <td data-row="row-inie" width="72" class="">
            <p class="ql-table-block" data-cell="cell-x6xx">7</p>
          </td>
          <td data-row="row-inie" width="72" class="">
            <p class="ql-table-block ql-align-center" data-cell="cell-8axw">8</p>
          </td>
          <td data-row="row-inie" width="72" class="">
            <p class="ql-table-block ql-align-center" data-cell="cell-45td">9</p>
          </td>
        </tr>
      </tbody>
    </table>`)

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
