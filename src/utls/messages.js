const messageHandlers = {}

chrome.runtime.onMessage.addListener((message) => {
  const handler = messageHandlers[message.label]
  if (!handler) {
    return
  }
  messageHandlers[message.label](message.content)
})

export function listenMessage(label, handler) {
  messageHandlers[label] = handler
}

export function sendMessage(label, content) {
  chrome.runtime.sendMessage({ label, content })
}
