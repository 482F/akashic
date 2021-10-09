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
