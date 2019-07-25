/** Tree implementation. */
import * as process from 'process'
import { getArray } from '../data/generate'

class TNode {
  value: number
  parent?: TNode
  left?: TNode
  right?: TNode

  constructor(value: number) {
    this.value = value
    this.left = undefined
    this.right = undefined
    this.parent = undefined
  }
}

class BinaryTree {
  root?: TNode
  size: number

  constructor() {
    this.root = undefined
    this.size = 0
  }
}

const insertTree = (tree: BinaryTree, value: number) => {
  if (!tree.root) {
    tree.root = new TNode(value)
    tree.size = 1
    return
  }

  let current: TNode = tree.root
  tree.size++

  // Mhmmmm. That is exactly what you think it is.
  while (!false) {
    if (current.value >= value) {
      if (!current.left) {
        current.left = new TNode(value)
        current.left.parent = current
        return
      }
      current = current.left
    } else {
      if (!current.right) {
        current.right = new TNode(value)
        current.right.parent = current
        return
      }
      current = current.right
    }
  }
}

/**
 * Shamelessly stolen from:
 * https://www.geeksforgeeks.org/print-binary-tree-2-dimensions/
 * And translated from C++ to node.js
 */
const dist = 4

const displayTreeInner = (node: TNode, space: number) => {
  if (!node) {
    return
  }

  space += dist

  displayTreeInner(node.right, space)

  process.stdout.write('\n')
  for (let i=dist; i<space; i++) {
    process.stdout.write(' ')
  }
  process.stdout.write(node.value+'\n')

  displayTreeInner(node.left, space)
}

const displayTree = (tree: BinaryTree) => {
  displayTreeInner(tree.root, 0)
}

let tr = new BinaryTree()
tr.root = undefined

let arr = getArray(30)

for (let i=0; i<arr.length; i++) {
  insertTree(tr, arr[i])
}

displayTree(tr)
console.log(tr.size)

