import { BinaryTree, TNode } from '../../src/tree/tree'

describe("Tree tests", function() {
  let tree:BinaryTree

  beforeEach(() => {
    tree = new BinaryTree()

    tree.insert(5)
    tree.insert(2)
    tree.insert(8)
    tree.insert(7)
    tree.insert(14)
    tree.insert(15)
  })

  it('should insert and find', () => {
    let tree = new BinaryTree()

    tree.insert(10)
    tree.insert(5)
    tree.insert(1)
    tree.insert(20)

    expect(tree.find(10).value).toEqual(10)
    expect(tree.find(5).value).toEqual(5)
    expect(tree.find(1).value).toEqual(1)
    expect(tree.find(20).value).toEqual(20)
  })

  it('should find values', () => {
    expect(tree.find(8).value).toEqual(8)
    expect(tree.find(5).value).toEqual(5)
    expect(tree.find(2).value).toEqual(2)
    expect(tree.find(15).value).toEqual(15)
  })

  it('should find, and find correct min and max values', () => {
    let found8:TNode = tree.find(8)
    expect(tree.findMax(found8).value).toEqual(15)
    expect(tree.findMin(found8).value).toEqual(2)

    expect(tree.findMin().value).toEqual(2)
    expect(tree.findMax().value).toEqual(15)
  })

  it('should find, and find correct NextSmaller and NextGreater values', () => {
    let found2:TNode = tree.find(2)
    expect(tree.findNextGreater(found2).value).toEqual(5)
    expect(tree.findNextSmaller(found2)).toEqual(null)

    let found15:TNode = tree.find(15)
    expect(tree.findNextSmaller(found15).value).toEqual(14)
    expect(tree.findNextGreater(found15)).toEqual(null)

    let found8:TNode = tree.find(8)
    expect(tree.findNextGreater(found8).value).toEqual(14)
    expect(tree.findNextSmaller(found8).value).toEqual(2)
  })

  it('should delete 14, find, and find correct NextSmaller and NextGreater values', () => {
    tree.delete(14)
    expect(tree.find(14)).toEqual(null)

    let found2:TNode = tree.find(2)
    expect(tree.findNextGreater(found2).value).toEqual(5)
    expect(tree.findNextSmaller(found2)).toEqual(null)

    let found15:TNode = tree.find(15)
    expect(tree.findNextSmaller(found15).value).toEqual(8)
    expect(tree.findNextGreater(found15)).toEqual(null)

    let found8:TNode = tree.find(8)
    expect(tree.findNextGreater(found8).value).toEqual(15)
    expect(tree.findNextSmaller(found8).value).toEqual(2)
  })

  it('should delete 8, find, and find correct NextSmaller and NextGreater values', () => {
    tree.delete(8)
    expect(tree.find(8)).toEqual(null)

    let found2: TNode = tree.find(2)
    expect(tree.findNextGreater(found2).value).toEqual(5)
    expect(tree.findNextSmaller(found2)).toEqual(null)

    let found15: TNode = tree.find(15)
    expect(tree.findNextSmaller(found15).value).toEqual(14)
    expect(tree.findNextGreater(found15)).toEqual(null)

    let found14: TNode = tree.find(14)
    expect(tree.findNextSmaller(found14).value).toEqual(2)
    expect(tree.findNextGreater(found14).value).toEqual(15)

  })

  it('should calculate insert height correctly', () => {
    expect(tree.root.height).toEqual(2)

    tree.insert(16)
    tree.insert(17)
    expect(tree.root.height).toEqual(3)
  })

  it('should calculate delete height correctly', () => {
    expect(tree.root.height).toEqual(2)

    tree.insert(16)
    tree.insert(17)
    expect(tree.root.height).toEqual(3)

    tree.delete(8)
    expect(tree.root.height).toEqual(3)
    expect(tree.find(16).height).toEqual(1)

    tree.delete(16)
    expect(tree.root.height).toEqual(2)
    expect(tree.find(15).height).toEqual(1)
  })

  it('should rotate right correctly', () => {
    tree = new BinaryTree()

    tree.insert(5)
    tree.insert(2)
    tree.insert(8)
    tree.insert(7)
    tree.insert(14)
    tree.insert(6)

    tree.rotateRight(tree.find(5))
    let find7: TNode = tree.find(7)
    expect(find7.left.value).toEqual(2)
    expect(find7.right.value).toEqual(8)
    expect(find7.height).toEqual(3)

    tree.rotateRight(tree.root)

    expect(tree.root.left).toEqual(null)
    expect(tree.root.right.value).toEqual(7)
    expect(tree.root.height).toEqual(3)

  })

  it('should rotate left correctly', () => {
    tree = new BinaryTree()

    tree.insert(5)
    tree.insert(2)
    tree.insert(8)
    tree.insert(7)
    tree.insert(14)
    tree.insert(6)

    tree.rotateLeft(tree.find(8))
    let find14: TNode = tree.find(14)
    expect(find14.left.value).toEqual(8)
    expect(find14.right).toEqual(null)
    expect(find14.height).toEqual(1)
    expect(tree.root).toEqual(tree.find(7))

    tree.rotateLeft(tree.root)
    expect(tree.root.left.value).toEqual(7)
    expect(tree.root.right).toEqual(null)
    expect(tree.root.height).toEqual(3)
    expect(tree.root.value).toEqual(14)
  })
})
