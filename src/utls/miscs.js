import { wait } from "@utls/asyncs.js"

export async function getFaviconBlob(url) {
  const request = new XMLHttpRequest()
  request.responseType = "blob"
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
  return blob.type === "image/png" ? blob : undefined
}
