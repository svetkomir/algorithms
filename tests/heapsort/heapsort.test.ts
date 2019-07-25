import { heapSort } from '../../src/heapsort/heapsort'

describe("Heapsort tests", function() {
  it("should sort correctly", function() {
    let a = [321, 544, 22, 443, 90, 1, 13, 16, 99, 4];

    console.log('Unsorted: ', a)
    heapSort(a)
    console.log('Sorted: ', a)

    expect(a).toEqual([ 1, 4, 13, 16, 22, 90, 99, 321, 443, 544 ]);
  });

  it("should sort correctly", function() {
    let a = [11, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    console.log('Unsorted: ', a)
    heapSort(a)
    console.log('Sorted: ', a)

    expect(a).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]);
  });
});