const task = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
      console.log(1)
    }, 1000)
  })
}


const tasks = [task, task, task, task]


tasks.reduce((p, n) => {
  if (typeof p === 'function') {
    return p().then(n)
  } else {
    return p.then(n)
  }
})