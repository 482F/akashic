import { sendMessage } from "@/utls.js"

async function main() {
  sendMessage("accessed", {
    url: location.href,
    name: document.title,
  })
}

main()
