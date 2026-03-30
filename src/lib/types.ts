export interface FixItBotConfig {
  /** Kilo webhook URL to submit bug reports to */
  webhookUrl: string
  /** Optional Bearer token for webhook authentication */
  apiKey?: string
  /** Lock the repo field to a specific repo (enables Support Portal Mode) */
  repoUrl?: string
  /** Default branch name (defaults to "main") */
  defaultBranch?: string
  /** Default programming language (defaults to "typescript") */
  defaultLanguage?: string
}

export interface FixItBotTheme {
  /** Primary color in HSL format, e.g. "45 100% 50%" */
  primary?: string
  /** Background color in HSL format */
  background?: string
  /** Foreground/text color in HSL format */
  foreground?: string
  /** Card background color in HSL format */
  card?: string
  /** Card foreground color in HSL format */
  cardForeground?: string
  /** Border color in HSL format */
  border?: string
  /** Input border color in HSL format */
  input?: string
  /** Focus ring color in HSL format */
  ring?: string
  /** Border radius, e.g. "0.75rem" */
  radius?: string
  /** Color mode: "dark" (default) or "light" */
  mode?: "dark" | "light"
}

export interface FixItBotLabels {
  /** Card title (default: "Fix_It_Bot" or "Support Portal" in support mode) */
  title?: string
  /** Card description text */
  description?: string
  /** Submit button text (default: "INITIATE REPAIR" or "SUBMIT REPORT") */
  submitButton?: string
  /** Submit button text while submitting */
  submittingButton?: string
  /** Success state title (default: "Fix In Progress") */
  successTitle?: string
  /** Success state description */
  successDescription?: string
  /** Button text to submit a new issue after success */
  newIssueButton?: string
  /** Description field label */
  descriptionLabel?: string
  /** Description field placeholder */
  descriptionPlaceholder?: string
}

export interface FixItBotCallbacks {
  /** Called when the form is submitted (before sending to webhook) */
  onSubmit?: (values: Record<string, unknown>) => void
  /** Called when the webhook responds successfully */
  onSuccess?: (data: { success: boolean; data?: Record<string, unknown>; prUrl?: string }) => void
  /** Called when submission fails */
  onError?: (error: Error) => void
}

export interface FixItBotProps {
  /**
   * Required configuration including webhook URL.
   * You can pass this object OR use the flat shorthand props below.
   */
  config?: FixItBotConfig
  /** Optional theme overrides */
  theme?: FixItBotTheme
  /** Optional label/text overrides */
  labels?: FixItBotLabels
  /** Optional callback functions */
  callbacks?: FixItBotCallbacks
  /** Additional CSS class name for the wrapper */
  className?: string
  /** Set to true if you already have a Sonner Toaster in your app */
  disableToaster?: boolean

  // ── Flat shorthand props (alternative to `config`) ──────────────

  /** Kilo webhook URL — shorthand for config.webhookUrl */
  webhookUrl?: string
  /** Optional Bearer token — shorthand for config.apiKey */
  apiKey?: string
  /** Lock the repo (enables Support Portal Mode) — shorthand for config.repoUrl */
  repoUrl?: string
  /** Default branch name — shorthand for config.defaultBranch */
  defaultBranch?: string
  /** Default language — shorthand for config.defaultLanguage */
  defaultLanguage?: string
}
