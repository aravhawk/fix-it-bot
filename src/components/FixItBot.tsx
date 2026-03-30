import * as React from "react"
import { BugReportForm } from "./BugReportForm"
import { Toaster } from "./ui/sonner"
import { cn } from "../lib/utils"
import { injectStyles } from "../lib/inject-styles"
import type { FixItBotProps, FixItBotConfig, FixItBotTheme } from "../lib/types"

function buildThemeStyle(theme?: FixItBotTheme): React.CSSProperties {
  if (!theme) return {}

  const style: Record<string, string> = {}

  if (theme.primary) style["--primary"] = theme.primary
  if (theme.background) style["--background"] = theme.background
  if (theme.foreground) style["--foreground"] = theme.foreground
  if (theme.card) style["--card"] = theme.card
  if (theme.cardForeground) style["--card-foreground"] = theme.cardForeground
  if (theme.border) style["--border"] = theme.border
  if (theme.input) style["--input"] = theme.input
  if (theme.ring) style["--ring"] = theme.ring
  if (theme.radius) style["--radius"] = theme.radius

  return style as React.CSSProperties
}

function resolveConfig(props: FixItBotProps): FixItBotConfig {
  // If `config` is provided, use it (flat props can still override)
  const base = props.config ?? { webhookUrl: "" }

  return {
    webhookUrl: props.webhookUrl ?? base.webhookUrl,
    apiKey: props.apiKey ?? base.apiKey,
    repoUrl: props.repoUrl ?? base.repoUrl,
    defaultBranch: props.defaultBranch ?? base.defaultBranch,
    defaultLanguage: props.defaultLanguage ?? base.defaultLanguage,
  }
}

export function FixItBot(props: FixItBotProps) {
  const { theme, labels, callbacks, className, disableToaster } = props

  // Auto-inject styles — no separate CSS import needed
  React.useEffect(() => {
    injectStyles()
  }, [])

  const config = resolveConfig(props)
  const mode = theme?.mode === "light" ? "light" : ""

  return (
    <div
      className={cn("fix-it-bot", mode, className)}
      style={buildThemeStyle(theme)}
    >
      <BugReportForm config={config} labels={labels} callbacks={callbacks} />
      {!disableToaster && <Toaster />}
    </div>
  )
}

export default FixItBot
