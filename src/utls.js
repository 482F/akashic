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

export async function wait(func, intervalMs = 100, timeoutMs = 0) {
  const startMs = new Date().getTime()
  while (!func()) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
    if (timeoutMs && timeoutMs < new Date().getTime() - startMs) {
      return false
    }
  }
  return true
}
