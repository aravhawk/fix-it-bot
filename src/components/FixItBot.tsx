import * as React from "react"
import { BugReportForm } from "./BugReportForm"
import { Toaster } from "./ui/sonner"
import { cn } from "../lib/utils"
import type { FixItBotProps, FixItBotTheme } from "../lib/types"

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

export function FixItBot({
  config,
  theme,
  labels,
  callbacks,
  className,
  disableToaster,
}: FixItBotProps) {
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
