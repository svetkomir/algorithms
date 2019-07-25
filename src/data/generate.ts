function random(low: number, high: number) {
  return Math.floor(Math.random() * (high - low) + low)
}

export const getArray = (size: number=1000) =>{ 
  let arr: Array<number> = new Array<number>()
  const upperBound = size * 2
  for (let i=0; i<size; i++) {
    arr.push(random(0,upperBound))
  }
  return arr
}
