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
  public value: number
  height: number = 0
  parent?: TNode = null
  left?: TNode = null
  right?: TNode = null

  constructor (value: number) {
    this.value = value
  }
}

export class BinaryTree {
  root?: TNode = null
  size: number = 0

  // This is a variable used for display. Increase for larger trees.
  dist: number = 5

  /**
   * Insert a value at the correct place
   * @param tree
   * @param value
   */
  insert = (value: number): TNode => {
    if (!this.root) {
      // Height defaults to 0 so we're good here
      this.root = new TNode(value)
      this.size = 1
      return this.root
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
          // Height defaults to 0 so we're good here
          current.left = new TNode(value)
          current.left.parent = current
          current = current.left
          break
        }
        current = current.left
      } else {
        if (!current.right) {
          // Height defaults to 0 so we're good here. Again.
          current.right = new TNode(value)
          current.right.parent = current
          current = current.right
          break
        }
        current = current.right
      }
    }

    let returnValue: TNode = current

    this.correctHeight(current)

    return current
  }

  /**
   * This goes from the starting node through node's parent until it reaches the root. 
   * Recalculates the height for each parent. Should work for delete or insert.
   */
  private correctHeight = (node: TNode) => {
    let current: TNode = node

    while (!false) {
      // Exit condition - we've reached the root node.
      if (!current.parent) {
        return
      }

      current.parent.height = Math.max(current.parent.left ? current.parent.left.height : -1,
        current.parent.right ? current.parent.right.height : -1) + 1

      current = current.parent
    }
  }

  /**
   * Pretty self explanatory. Same complexity as binary search.
   */
  find = (searchValue: number, node: TNode = this.root): TNode => {
    if (!node) {
      return null
    }

    let current: TNode = node

    while (current && current.value !== searchValue) {
      if (current.value > searchValue) {
        current = current.left
      } else {
        current = current.right
      }
    }

    return current
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

    let current: TNode = node

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

    let current: TNode = node

    while (current.right) {
      current = current.right
    }

    return current
  }

  /**
   * AKA "sucessor" of the parameter node.
   * Funny thing - we don't need to look at the values to find the next larger.
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

    let current: TNode = node

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

    let current: TNode = node

    while (current.parent && current.parent.right !== current) {
      current = current.parent
    }

    // At this point we have found the next smaller or the next smaller doesn't exist.
    // If it doesn't exist we'll return null.
    return current.parent
  }

  delete = (value: number): boolean => {
    let node = this.find(value)

    if (!node) {
      return false
    }

    this.size--
    return this.deleteNode(node)
  }

  deleteNode = (node: TNode): boolean => {
    if (!node) {
      return false
    }

    // If we have left node but no right one
    if (node.left && !node.right) {
      this.size--
      // If we're trying to delete the root level - set root to left
      if (!node.parent) {
        this.root = node.left
        this.root.parent = null
      } else {
        // This is not the root level
        // If the parent is pointing to the left to current - reset parent.left
        if (node.parent.left === node) {
          node.parent.left = node.left
        } else {
          // Otherwise - reset parent.right
          node.parent.right = node.left
        }
        // Correct the parent link
        node.left.parent = node.parent

        // At this point the deletion is complete. Run the height recalculation routine.
        // Start from the node that was moved "up".
        this.correctHeight(node.left)
      }
    // Same thing, but inverted
    } if (!node.left && node.right) {
      this.size--
      if (!node.parent) {
        this.root = node.right
        this.root.parent = null
      } else {
        // We're still checking the parent connection the same way -
        // just assigning the right child (because in this case only the right exists)
        if (node.parent.left === node) {
          node.parent.left = node.right
        } else {
          node.parent.right = node.right
        }
        // Correct the parent link
        node.right.parent = node.parent

        // At this point the deletion is complete. Run the height recalculation routine.
        // Start from the node that was moved up a level.
        this.correctHeight(node.right)
      }
    } else {
      // And this is the most complicated scenario - when the node has two children

      // Find the next greatest value
      let sucessor = this.findNextGreater(node)

      // Swap the values in the nodes
      node.value = sucessor.value

      // Delete the sucessor value. This will work because the successor node only ever
      // has one child and we're guaranteed to stop before going into infinite loop.
      return this.deleteNode(sucessor)
    }

    return true
  }

  avlInsert (value: number) {
    this.insert(value)

    this.fixAvl()
  }

  fixAvl = () => {
    // TODO
  }

  rightRotate = (node: TNode): TNode => {
    return null
  }

  /**
   * Shamelessly stolen from:
   * https://www.geeksforgeeks.org/print-binary-tree-2-dimensions/
   * And translated from C++ to typescript.
   */
  private displayInner = (node: TNode, space: number) => {
    if (!node) {
      return
    }

    space += this.dist

    this.displayInner(node.right, space)

    process.stdout.write('\n')
    for (let i = this.dist; i < space; i++) {
      process.stdout.write(' ')
    }
    process.stdout.write(node.value + ' (' + node.height + ')\n')

    this.displayInner(node.left, space)
  }

  display = () => {
    this.displayInner(this.root, 0)
  }
}
