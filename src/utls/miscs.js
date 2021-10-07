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
