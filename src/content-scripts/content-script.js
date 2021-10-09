import { wait, sleep } from "@utls/asyncs.js"
import { sendMessage } from "@utls/messages.js"

async function main() {
  let title = document.title
  await sleep(3000)
  await wait(() => {
    if (title === document.title) {
      return true
    }
    title = document.title
  }, 3000)
  sendMessage("accessed", {
    url: location.href,
    name: title,
  })
}

main()
