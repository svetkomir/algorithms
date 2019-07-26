/** Tree implementation. */
import * as process from 'process'

/**
 * Thoughts on tree nodes:
 * 
 * 1. If the value is a simple type (number, string, bool and 
 * so forth) we can have a counter variable for repeating nodes.
 * 
 */
export class TNode {
  value: number
  parent?: TNode
  left?: TNode
  right?: TNode

  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
    this.parent = null
  }
}

export class BinaryTree {
  root?: TNode = null
  size: number = 0

  dist: number = 5

  /**
   * Insert a value at the correct place
   * @param tree 
   * @param value 
   */
  insert = (value: number) => {
    if (!this.root) {
      this.root = new TNode(value)
      this.size = 1
      return
    }

    let current: TNode = this.root
    this.size++

    /** 
     * Mhmmmm. That is exactly what you think it is. 
     * They say when you know the rules you can break them.
     * Famous last words. 
     */
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
   * Find the minimum node, starting from the parameter node.
   * 
   * @param node 
   */
  findMin = (node: TNode = this.root): TNode => {
    if (!node) {
      return null
    }

    let current: TNode = node;

    while (current.left) {
      current = current.left
    }

    return current
  }

  /**
   * Find the maximum node, starting from the parameter node.
   * 
   * @param node 
   */
  findMax = (node: TNode = this.root): TNode => {
    if (!node) {
      return null
    }

    let current: TNode = node;

    while (current.right) {
      current = current.right
    }

    return current
  }

  /**
   * AKA "successor" of the parameter node. 
   * Funny thing - we don't need to look at the values to find the next larger.
   * Maybe we should depending on how we handle repeating values. 
   * 
   * @param node
   */
  findNextGreater = (node: TNode = this.root): TNode => {
    if (!node) {
      return null
    }

    if (node.right) {
      return this.findMin(node.right)
    }

    let current: TNode = node;

    while (current.parent && current.parent.left !== current) {
      current = current.parent
    }

    // At this point we have found the next larger or the next larger doesn't exist.
    // If it doesn't exist we'll return null.
    return current.parent
  }

  /**
   * AKA "predecessor" of the parameter node. Just switch left for right - done. 
   * 
   * @param node
   */
  findNextSmaller = (node: TNode = this.root): TNode => {
    if (!node) {
      return null
    }

    if (node.left) {
      return this.findMin(node.left)
    }

    let current: TNode = node;

    while (current.parent && current.parent.right !== current) {
      current = current.parent
    }

    // At this point we have found the next smaller or the next smaller doesn't exist.
    // If it doesn't exist we'll return null.
    return current.parent
  }

  /**
   * Shamelessly stolen from:
   * https://www.geeksforgeeks.org/print-binary-tree-2-dimensions/
   * And translated from C++ to typescript.
   */
  displayInner = (node: TNode, space: number) => {
    if (!node) {
      return
    }

    space += this.dist

    this.displayInner(node.right, space)

    process.stdout.write('\n')
    for (let i = this.dist; i<space; i++) {
      process.stdout.write(' ')
    }
    process.stdout.write(node.value+'\n')

    this.displayInner(node.left, space)
  }

  display = () => {
    this.displayInner(this.root, 0)
  }
}

