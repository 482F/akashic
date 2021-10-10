export async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function wait(func, intervalMs = 1, timeoutMs = 0) {
  const startMs = new Date().getTime()
  while (!func()) {
    await sleep(intervalMs)
    if (timeoutMs && timeoutMs < new Date().getTime() - startMs) {
      return false
    }
  }
  return true
}

export function assignAsyncGenerator(asyncGenerator, parentObj, assignKey) {
  parentObj[assignKey] = []
  async function addingValue() {
    for await (const value of asyncGenerator) {
      parentObj[assignKey].push(value)
    }
  }
  addingValue()
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
