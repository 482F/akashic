import { wait } from "@utls/asyncs.js"

export async function setStorage(key, value) {
  let finished = false
  chrome.storage.local.set({ [key]: value }, () => {
    finished = true
  })
  await wait(() => finished)
}

export async function getStorage(key, defaultValue = undefined) {
  let value = null
  chrome.storage.local.get([key], (result) => {
    value = result[key]
  })
  await wait(() => value !== null)
  return value === undefined ? defaultValue : value
}
