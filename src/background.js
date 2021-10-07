import { sleep } from "@utls/asyncs.js"
import {
  setValueByKey,
  getValueByKey,
  setValueById,
  pushToList,
} from "@utls/storages.js"
import { getFaviconIntArr } from "@utls/miscs.js"
import { listenMessage } from "@utls/messages.js"

const waitingLine = []

async function main() {
  chrome.commands.onCommand.addListener((command) => {
    if (command === "openConfig") {
      chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/options.html",
      })
    } else if (command === "reload") {
      chrome.runtime.reload()
    }
  })

  listenMessage("accessed", addWaitingLine)
  for (;;) {
    await sleep(1000)
    if (waitingLine.length) {
      await waitingLine.shift()()
    }
  }
}

function addWaitingLine(obj) {
  waitingLine.push(async function () {
    await setHistory(obj)
  })
}

async function setHistory(obj) {
  let history = await getValueByKey("page", obj.url)
  const domain = new URL(obj.url).hostname
  if (!history) {
    history = {
      url: obj.url,
      domain: undefined,
      name: obj.name,
      star: false,
      accessDates: [],
      tags: {},
    }
  }
  history.accessDates.push(new Date().getTime())
  const pageId = await setValueByKey("page", obj.url, history)
  await pushToList("history", pageId)
  let domainObj = await getValueByKey("domain", domain)
  if (!domainObj) {
    domainObj = {
      domain,
      favicon: await getFaviconIntArr(obj.url),
      pages: {},
    }
  }
  domainObj.pages[pageId] = null
  const domainId = await setValueByKey("domain", domain, domainObj)
  history.domain = domainId
  await setValueById("page", pageId, history)
}

main()
