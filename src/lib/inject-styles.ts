import { cssText } from "./__styles.generated"

const STYLE_ID = "fix-it-bot-styles"
let injected = false

export function injectStyles(): void {
  if (injected) return
  if (typeof document === "undefined") return // SSR safety

  if (document.getElementById(STYLE_ID)) {
    injected = true
    return
  }

  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = cssText
  document.head.appendChild(style)
  injected = true
}
