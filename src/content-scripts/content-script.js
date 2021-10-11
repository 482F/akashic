import { wait, sleep } from "@utls/asyncs.js"
import { sendMessage } from "@utls/messages.js"
import { getValueByKey, updateValueByKey } from "@utls/storages.js"

async function main() {
  let url = ""
  let name = ""
  for (;;) {
    if (url !== location.href) {
      url = location.href
      name = document.title
      sendMessage("accessed", {
        url,
        name,
      })
      await wait(async function () {
        return getValueByKey("page", location.href)
      })
    } else if (name !== document.title) {
      name = document.title
      console.log("name", name)
      await updateValueByKey("page", location.href, { name })
    }
    await sleep(3000)
  }
}

main()
