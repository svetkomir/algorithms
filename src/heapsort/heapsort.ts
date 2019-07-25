/**
 * This module implements heapsort. It's an array sorting algorithm with 
 * Big O(n*(lg n)) complexity (same as quicksort). It sorts in place, but 
 * it represents the array as a tree with specific formulas for the 
 * indices of each node.
 * 
 * Left node: 2*i (where i is the current index)
 * Right node: 2*i + 1
 */
import { swap } from '../lib/array'

interface Heap {
  array: number[],
  size: number
}

/**
 * Builds a Max Heap from a Heap. In a Max Heap every node is greater than or 
 * equal to both its children. 
 * 
 * maxHeapify has the requirement that both the left and right children are
 * max heaps. If that is not correct then this will not work!
 * @param heap 
 * @param root 
 */
const maxHeapify = (heap: Heap, root: number)  => {
  // Calculate index of left and right nodes
  // formulas are 2*i and 2*i+1, but if array indices started at 1 hehe I wish
  const left: number = 2*(root+1)-1
  const right: number = 2*(root+1) 

  let maxHeapifyLeft: boolean = false
  let maxHeapifyRight: boolean = false

  // If left node exists and value is greater than root - swap and flag
  if (left < heap.size && heap.array[root]<heap.array[left]) {
    swap(heap.array, root, left)
    maxHeapifyLeft = true
  }
  
  // Same operation on the right node
  if (right < heap.size && heap.array[root]<heap.array[right]) {
    swap(heap.array, root, right)
    maxHeapifyRight = true
  }

  // If we swapped anything out of the children we need to run maxHeapify on them

  // Uncomment the next line to watch each step(ish)
  //console.log(heap)
  if (maxHeapifyLeft) {
    maxHeapify(heap, left)
  }

  if (maxHeapifyRight) {
    maxHeapify(heap, right)
  }
}

/**
 * We start working backwards from the middle element, because all the elements past 
 * the middle are guaranteed to be leaves. Leaves are maxHeaps by definition so
 * we don't need to run maxHeapify on them.
 * @param heap 
 */
const buildMaxHeap = (heap: Heap) => {
  for (let i=Math.floor((heap.size-1) / 2); i >= 0; i--) {
    maxHeapify(heap, i)
  }
}

export const heapSort = async (array: number[]) => {
  let heap:Heap = {
    array: array,
    size: array.length
  }
  
  while (heap.size>0){
    // Build max heap
    buildMaxHeap(heap)

    // At this point we know that we have the max element at first position
    // We swap it with the last element and exclude the last element by decrementing the size
    // of the heap. Then we can run buildMaxHeap again (when we loop) because the condition 
    // for left and right to be max heaps is still fulfilled
    swap(heap.array, 0, heap.size-1)
    heap.size--
  }
}
