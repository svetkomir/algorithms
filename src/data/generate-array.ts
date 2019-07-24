function random(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

for (let i=1; i<100; i++) {
  console.log(random(0,4000) + ',')
}

