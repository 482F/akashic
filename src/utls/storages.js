import { wait, sleep } from "@utls/asyncs.js"

export async function setStorage(...keysAndValue) {
  const keys = keysAndValue?.slice(0, -1)
  const value = keysAndValue?.slice(-1)?.[0]
  if (!keys?.length || !value) {
    return
  }
  const key = keys.join(":")
  let finished = false
  chrome.storage.local.set({ [key]: value }, () => {
    finished = true
  })
  await wait(() => finished)
}

export async function getStorage(...keys) {
  if (!keys?.length) {
    return
  }
  const key = keys.join(":")
  let value = null
  chrome.storage.local.get([key], (result) => {
    value = result[key]
  })
  await wait(() => value !== null)
  return value
}

const varKey = "var"
const idKey = "id"
const lengthKey = "length"

export async function setValueByKey(category, key, value) {
  let id = await getStorage(category, key)
  if (!id) {
    id = ((await getStorage(varKey, lengthKey, category)) || 0) + 1
    await setStorage(category, key, id)
    await setStorage(varKey, lengthKey, category, id)
  }
  await setValueById(category, id, value)
  return id
}

export async function setValueById(category, id, value) {
  await setStorage(category, idKey, id, value)
}

export async function getValueByKey(category, key) {
  const id = await getStorage(category, key)
  return await getValueById(category, id)
}

export async function getValueById(category, id) {
  return await getStorage(category, idKey, id)
}

const maxListContentNumber = 1000

export async function pushToList(...keysAndValue) {
  const keys = keysAndValue?.slice(0, -1)
  const value = keysAndValue?.slice(-1)?.[0]
  if (!keys?.length || !value) {
    return
  }
  let length = await getStorage(varKey, lengthKey, ...keys)
  if (!length) {
    length = 1
    await setStorage(varKey, lengthKey, ...keys, length)
    await setStorage(...keys, length - 1, [])
  }
  const list = await getStorage(...keys, length - 1)
  list.push(value)
  await setStorage(...keys, length - 1, list)
  if (maxListContentNumber <= list.length) {
    await setStorage(varKey, lengthKey, ...keys, length + 1)
    await setStorage(...keys, length, [])
  }
}

export async function* getListContents(...keys) {
  if (!keys?.length) {
    return
  }
  const length = await getStorage(varKey, lengthKey, ...keys)
  if (!length) {
    return
  }
  for (let index = 0; index < length; index++) {
    const contents = await getStorage(...keys, index)
    for (const content of contents) {
      yield content
      await sleep(0)
    }
  }
}
