import { getArray, random } from '../data/generate'
import { AvlTree } from './avl-tree'

let tr = new AvlTree()
let arr = getArray(100)

for (let i = 0; i < arr.length; i++) {
  tr.insert(arr[i])
}

tr.display()

for (let i = 0;i < 10;i++) {
  tr.delete(arr[random(0,99)])
}
console.log('-----------------------------------')
tr.display()

console.log(`max value is ${tr.findMax().value}`)
console.log(`min value is ${tr.findMin().value}`)
