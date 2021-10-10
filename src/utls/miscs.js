import { wait } from "@utls/asyncs.js"

export async function getFaviconIntArr(url) {
  const request = new XMLHttpRequest()
  request.responseType = "arraybuffer"
  request.open(
    "GET",
    `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`,
    true
  )
  let blob = null
  request.onload = function () {
    blob = this.response
  }
  request.send()
  await wait(() => {
    return blob
  })
  return Array.from(new Uint8Array(blob))
}

export function faviconIntArrToImgSrc(intArr) {
  const data = new Uint8Array(intArr)
  return URL.createObjectURL(new Blob([data], { type: "image/png" }))
}

export function fillNum(str, digits) {
  if (digits <= str.length) {
    return str
  }
  return (Array(digits).fill("0") + str).slice(-digits)
}

export function dateToText(date) {
  const y = date.getFullYear()
  const mo = fillNum(date.getMonth(), 2)
  const d = fillNum(date.getDate(), 2)
  const h = fillNum(date.getHours(), 2)
  const mi = fillNum(date.getMinutes(), 2)
  const s = fillNum(date.getSeconds(), 2)
  return `${y}/${mo}/${d} ${h}:${mi}:${s}`
}
