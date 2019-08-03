
interface Countable {
  key (): number
}

/**
 * Linear time, but arr.length + valueMax memory
 * 
 * @param arr 
 * @param valueMax 
 */
export function countingSort<T extends Countable> (arr: T[], valueMax: number) {
  let counts: number[] = new Array<number>(valueMax)
  for (let i = 0; i < valueMax; i++) {
    counts[i] = 0
  }

  for (let i = 0; i < arr.length; i++) {
    counts[arr[i].key()]++
  }
}

class CElement implements Countable {
  keyProperty: number
  public key (): number {
    return this.keyProperty
  }

  CElement(value: number) {
    this.keyProperty = value
  }
}

countingSort([1,2,3], 4)
