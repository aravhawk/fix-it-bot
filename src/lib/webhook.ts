import type { FixItBotConfig } from "./types"

interface WebhookPayload {
  repoUrl: string
  branchSha: string
  description: string
  priority: string
  language: string
  timestamp: string
  source: string
}

interface WebhookResult {
  success: boolean
  data?: Record<string, unknown>
  prUrl?: string
}

export async function submitToKilo(
  values: {
    repoUrl: string
    branchSha: string
    description: string
    priority?: string
    language?: string
  },
  config: FixItBotConfig
): Promise<WebhookResult> {
  // Format repo URL if needed
  let repoUrl = values.repoUrl
  if (!repoUrl.startsWith("http")) {
    repoUrl = `https://github.com/${repoUrl}`
  }

  const payload: WebhookPayload = {
    repoUrl,
    branchSha: values.branchSha,
    description: values.description,
    priority: values.priority || "medium",
    language: values.language || config.defaultLanguage || "unknown",
    timestamp: new Date().toISOString(),
    source: "fix-it-bot",
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Fix-It-Bot/1.0",
  }

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`
  }

  const response = await fetch(config.webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Webhook request failed (${response.status}): ${errorText}`)
  }

  const result = await response.json()

  return {
    success: true,
    data: result,
    prUrl: result?.prUrl,
  }
}
