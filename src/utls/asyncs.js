export async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function wait(func, intervalMs = 100, timeoutMs = 0) {
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
    for await (const value of asyncGenerator()) {
      parentObj[assignKey].push(value)
    }
  }
  addingValue()
}
