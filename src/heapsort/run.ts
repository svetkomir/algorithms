import { heapSort } from './heapsort'
import { getArray } from '../data/generate'

let genArr1000 = getArray(1000)
let genArr10000 = getArray(10000)
let genArr100000 = getArray(100000)

const run = () => {
  const before1000 = Date.now()
  heapSort(genArr1000)
  console.log(`1000 elements took ${Date.now() - before1000} milliseconds`)

  const before10000 = Date.now()
  heapSort(genArr10000)
  console.log(`10000 elements took ${Date.now() - before10000} milliseconds`)

  const before100000 = Date.now()
  heapSort(genArr100000)
  console.log(`100000 elements took ${Date.now() - before100000} milliseconds`)
}

run()