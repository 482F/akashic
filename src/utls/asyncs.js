export async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function wait(func, intervalMs = 1, timeoutMs = 0) {
  const startMs = new Date().getTime()
  while (!(await func())) {
    await sleep(intervalMs)
    if (timeoutMs && timeoutMs < new Date().getTime() - startMs) {
      return false
    }
  }
  return true
}

const assigns = {}

export function assignAsyncGenerator(asyncGenerator, parentObj) {
  const assignId = new Date().getTime + Math.random()
  assigns[assignId] = true

  const stopFunc = () => {
    assigns[assignId] = false
  }

  parentObj.value = []
  parentObj.finished = false
  async function addingValue() {
    for await (const value of asyncGenerator) {
      if (!assigns[assignId]) {
        break
      }
      parentObj.value.push(value)
    }
    parentObj.finished = true
  }
  addingValue()
  return stopFunc
}

export async function* mapAsyncGenerator(asyncGenerator, func) {
  for await (const value of asyncGenerator) {
    yield await func(value)
    await sleep(0)
  }
}

export async function* filterAsyncGenerator(asyncGenerator, func) {
  for await (const value of asyncGenerator) {
    if (await func(value)) {
      yield value
    }
    await sleep(0)
  }
}

export async function* uniqueAsyncGenerator(asyncGenerator, func) {
  const values = []
  for await (const value of asyncGenerator) {
    if (!values.some((already) => func(already, value))) {
      values.push(value)
      yield value
    }
  }
}
