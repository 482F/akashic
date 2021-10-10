import { wait, sleep } from "@utls/asyncs.js"
import { sendMessage } from "@utls/messages.js"
import { getValueByKey, updateValueByKey } from "@utls/storages.js"

async function main() {
  let title = document.title
  sendMessage("accessed", {
    url: location.href,
    name: title,
  })
  await wait(async function () {
    return getValueByKey("page", location.href)
  })
  for (;;) {
    await sleep(3000)
    if (title !== document.title) {
      title = document.title
      await updateValueByKey("page", location.href, { name: title })
    }
  }
}

main()
