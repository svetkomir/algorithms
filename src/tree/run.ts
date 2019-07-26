import { getArray } from '../data/generate'
import { BinaryTree } from './tree'

let tr = new BinaryTree()
let arr = getArray(10)

for (let i=0; i<arr.length; i++) {
  tr.insert(arr[i])
}

tr.display()

console.log(`max value is ${tr.findMax().value}`)
console.log(`min value is ${tr.findMin().value}`)



