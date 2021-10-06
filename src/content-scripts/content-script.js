import { sendMessage } from "@utls/messages.js"

async function main() {
  sendMessage("accessed", {
    url: location.href,
    name: document.title,
  })
}

main()
