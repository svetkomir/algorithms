/**
 * AVL Tree implementation. AVL Tree is a balanced binary search tree.
 * The important methods are the height calculation and maintenance and
 * the rotation routines. The rotation is used to rebalance the tree. Rebalancing
 * is done after insertion and deletion.
 *
 */
import * as process from 'process'

/**
 * Thoughts on tree nodes:
 *
 * 1. If the value is a simple type (number, string, bool and
 * so forth) we can have a counter variable for repeating nodes.
 *
 * 2. If it's an object then we can build a linked list on each
 * node to track objects with duplicate keys
 * 
 * 3. The tree will work fine with duplicate keys, but it will be slower
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
  dist: number = 10

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

    this.recalcHeightAndBalance(current)

    return returnValue
  }

  recalcNodeHeight = (node: TNode) => {
    if (!node) {
      return
    }

    node.height = Math.max(node.left ? node.left.height : -1,
      node.right ? node.right.height : -1) + 1
  }

  getChildrenHeights = (node: TNode): any => {
    if (!node) {
      return {
        leftHeight: -1,
        rightHeight: -1
      }
    }

    return {
      leftHeight: node.left ? node.left.height : -1,
      rightHeight: node.right ? node.right.height : -1
    }
  }

  /**
   * Where the magic happens. Rotate node to rebalance if required.
   * There are two simple scenarios where we simply must rotate right or left.
   *
   * And there are two more complex scenarios where we have to rotate right-left or left right.
   *
   * The complex scenario can be explained like this:
   *
   *    Rotate b left            Rotate a right
   *
   *          a                         a                     f
   *        /   \                     // \\                 /   \
   *       b     c                   f     c               b     a
   *     // \\     \    ->         /   \     \    ->      / \    / \
   *    e     f     g             b     i     g          e   h  i   c
   *         / \                 / \     \                       \   \
   *        h   i               e   h     j                       j   g
   *             \
   *              j
   * If we simply rotate a to the right we won't get a balanced tree because f will be moved
   * to left child of a and the tree root will be right heavy instead of left heavy.
   *
   * This is why we need to rotate b to the left first. That way a's left child will become left heavy(or balanced)
   * and we can rotate a to the right to balance the tree.
   */
  rebalanceNode = (node: TNode): TNode => {
    if (!node) {
      return node
    }

    const { leftHeight, rightHeight } = this.getChildrenHeights(node)

    // If node is not balanced AKA more than 1 difference in height between the node's children
    if (Math.abs(leftHeight - rightHeight) >= 2) {
      // Node is left heavy - we need to rotate right
      if (leftHeight > rightHeight) {
        const childHeights = this.getChildrenHeights(node.left)
        // If the left child is right heavy then we need to rotate it left first
        if (childHeights.rightHeight > childHeights.leftHeight) {
          this.rotateLeft(node.left)
        }
        return this.rotateRight(node)
      } else {
        // Same thing as above but inverted
        const childHeights = this.getChildrenHeights(node.right)
        if (childHeights.leftHeight > childHeights.rightHeight) {
          this.rotateRight(node.right)
        }
        return this.rotateLeft(node)
      }
    }

    return node
  }

  /**
   * This goes from the starting node through node's parent until it reaches the root.
   * Recalculates the height for each parent. After recalculation it rebalances each
   * parent as needed. Should work for delete or insert.
   */
  private recalcHeightAndBalance = (node: TNode) => {
    if (!node) {
      return
    }

    let current: TNode = node

    while (!false) {
      // Exit condition - we've reached the root node.
      if (!current.parent) {
        return
      }

      this.recalcNodeHeight(current.parent)

      current = current.parent

      current = this.rebalanceNode(current)
    }
  }

  /**
   * Rotates node (a) to the right. Constant complexity.
   *
   *         a              b
   *        / \            / \
   *       b   c   ->     d   a
   *      / \            /   / \
   *     d  e           f   e   c
   *    /
   *   f
   */
  rotateRight = (node: TNode): TNode => {
    if (!node || !node.left) {
      // We can't rotate to the right if the node doesn't exist
      // or if it doesn't have a left child

      return node
    }

    // Save the left node (b)
    let leftNode: TNode = node.left

    // Move the left node's right child to the node's right left child
    // (e) becomes a child of (a)
    node.left = leftNode.right

    // If (e) exists then set the parent of (e) to point to (a)
    if (node.left) {
      node.left.parent = node
    }

    // Set (a) to be the right child of (b)
    leftNode.right = node

    // Set the parent of (a) to be the parent of (b)
    leftNode.parent = node.parent

    // Set (b) to be the parent of (a)
    node.parent = leftNode

    // If at this point the parent of (b) is null then we're at the root
    // In this case we set the root of the tree to (b) and we're done.
    if (!leftNode.parent) {
      this.root = leftNode
    } else {
      // If this is not root then we need to update the parent of (a)
      // If (a) is the left child then we update the left link to (b)
      if (leftNode.parent.left === node) {
        leftNode.parent.left = leftNode

      // Otherwise we update the right link
      } else {
        leftNode.parent.right = leftNode
      }
    }

    // Recalculate the correct heights. Start from the lowest levels for correct result.
    this.recalcNodeHeight(leftNode.left)
    this.recalcNodeHeight(leftNode.right)
    this.recalcNodeHeight(leftNode)

    let current: TNode = leftNode.parent
    while (current) {
      this.recalcNodeHeight(current)
      current = current.parent
    }

    return leftNode
  }

  /**
   * Rotates node (a) to the left. Constant complexity.
   *
   *         a              c
   *        / \            / \
   *       b   c   ->     a   e
   *          / \        / \   \
   *         d   e      b   d   f
   *              \
   *               f
   */
  rotateLeft = (node: TNode): TNode => {
    if (!node || !node.right) {
      // We can't rotate to the left if the node doesn't exist
      // or if it doesn't have a right child

      return node
    }

    // Save the right node (c)
    let rightNode: TNode = node.right

    // Move the right node's left child to the node's right child
    // (d) becomes a right child of (a)
    node.right = rightNode.left

    // If (d) exists then set the parent of (d) to point to (a)
    if (node.right) {
      node.right.parent = node
    }

    // Set (a) to be the right child of (c)
    rightNode.left = node

    // Set the parent of (c) as the parent of (a)
    rightNode.parent = node.parent

    // Set (c) to be the parent of (a)
    node.parent = rightNode

    // If at this point the parent of (c) is null then we're at the root
    // In this case we set the root of the tree to (c) and we're done.
    if (!rightNode.parent) {
      this.root = rightNode
    } else {
      // If this is not root then we need to update the parent of (a)
      // If (a) is the left child then we update the left link to (c)
      // This logic is not inverted because we're just checking the
      // parent left and right children
      if (rightNode.parent.left === node) {
        rightNode.parent.left = rightNode

      // Otherwise we update the right link
      } else {
        rightNode.parent.right = rightNode
      }
    }

    // Recalculate the correct heights. Start from the lowest levels for correct result.
    this.recalcNodeHeight(rightNode.left)
    this.recalcNodeHeight(rightNode.right)
    this.recalcNodeHeight(rightNode)

    let current: TNode = rightNode.parent
    while (current) {
      this.recalcNodeHeight(current)
      current = current.parent
    }

    return rightNode
  }

  /**
   * Pretty self explanatory. Same complexity as binary search Big O(log n)
   * This is only if the tree is balanced. If it's not balanced the complexity is
   * Big O(h) where h is the height and in the worst case scenario h=n
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

    // Simplest scenario - the node to delete is a leaf. Just remove it.
    if (!node.left && !node.right) {
      let parent: TNode = node.parent
      // Root node
      if (node.parent === null) {
        this.root = null
        this.size = 0
      } else if (node.parent.left === node) {
        node.parent.left = null
      } else {
        // Otherwise - reset parent.right
        node.parent.right = null
      }
      node.parent = null

      // After deleting the leaf we must recalculate height and rebalance if necessary
      this.recalcHeightAndBalance(parent)
      return true
    // If we have left node but no right one
    } else if (node.left && !node.right) {
      this.size--
      // If we're trying to delete the root level - set root to left
      if (!node.parent) {
        this.root = node.left
        this.root.parent = null
        this.recalcHeightAndBalance(this.root)
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
        this.recalcHeightAndBalance(node.left)
      }
    // Same thing, but inverted
    } else if (!node.left && node.right) {
      this.size--
      if (!node.parent) {
        this.root = node.right
        this.root.parent = null
        this.recalcHeightAndBalance(this.root)
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
        this.recalcHeightAndBalance(node.right)
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
    console.log('------------------------------------------')
  }
}
