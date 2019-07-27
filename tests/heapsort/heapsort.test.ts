import { heapSort } from '../../src/heapsort/heapsort'

describe('Heapsort tests', () => {
  it('should sort correctly', async () => {
    let a = [321, 544, 22, 443, 90, 1, 13, 16, 99, 4]

    await heapSort(a)

    expect(a).toEqual([ 1, 4, 13, 16, 22, 90, 99, 321, 443, 544 ])
  })

  it('should sort correctly', async () => {
    let a = [11, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

    await heapSort(a)

    expect(a).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ])
  })
})