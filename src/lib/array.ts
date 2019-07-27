export const swap = (array: number[], i: number, j: number) => {
  let temp = array[i]
  array[i] = array[j]
  array[j] = temp
}
