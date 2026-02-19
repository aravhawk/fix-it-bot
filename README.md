# fix-it-bot-react

Drop-in React component for submitting bug reports to [Kilo](https://kilo.ai) AI agents. Submit a bug report, Kilo analyzes the repo and creates a pull request automatically.

## Installation

```bash
pnpm add fix-it-bot-react
```

## Quick Start

```tsx
import { FixItBot } from 'fix-it-bot-react'
import 'fix-it-bot-react/styles.css'

function App() {
  return (
    <FixItBot
      config={{
        webhookUrl: 'https://api.kilo.ai/webhooks/abc123',
      }}
    />
  )
}
```

## Usage

### Minimal

```tsx
<FixItBot config={{ webhookUrl: 'https://api.kilo.ai/webhooks/abc123' }} />
```

### Support Portal Mode

Lock the repo field to a specific repository — useful for embedding on your project's support page:

```tsx
<FixItBot
  config={{
    webhookUrl: 'https://api.kilo.ai/webhooks/abc123',
    repoUrl: 'owner/repo',
    defaultBranch: 'main',
  }}
/>
```

### Full Configuration

```tsx
<FixItBot
  config={{
    webhookUrl: 'https://api.kilo.ai/webhooks/abc123',
    apiKey: 'optional-bearer-token',
    repoUrl: 'owner/repo',
    defaultBranch: 'main',
    defaultLanguage: 'typescript',
  }}
  theme={{
    primary: '142 71% 45%',
    radius: '0.75rem',
    mode: 'light',
  }}
  labels={{
    title: 'Report a Bug',
    submitButton: 'SEND REPORT',
  }}
  callbacks={{
    onSuccess: (data) => console.log('PR:', data.prUrl),
    onError: (err) => console.error(err),
  }}
  className="my-custom-class"
/>
```

## Props

### `config` (required)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `webhookUrl` | `string` | Yes | Kilo webhook URL to submit bug reports to |
| `apiKey` | `string` | No | Bearer token for webhook authentication |
| `repoUrl` | `string` | No | Locks the repo field (enables Support Portal Mode) |
| `defaultBranch` | `string` | No | Default branch name (defaults to `"main"`) |
| `defaultLanguage` | `string` | No | Default language hint (defaults to `"typescript"`) |

### `theme`

All color values use HSL format without the `hsl()` wrapper, e.g. `"45 100% 50%"`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | `string` | `"45 100% 50%"` | Primary/accent color |
| `background` | `string` | `"220 20% 4%"` | Background color |
| `foreground` | `string` | `"210 20% 98%"` | Text color |
| `card` | `string` | `"220 20% 6%"` | Card background |
| `cardForeground` | `string` | — | Card text color |
| `border` | `string` | — | Border color |
| `input` | `string` | — | Input border color |
| `ring` | `string` | — | Focus ring color |
| `radius` | `string` | `"0rem"` | Border radius |
| `mode` | `"dark" \| "light"` | `"dark"` | Color mode |

### `labels`

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title |
| `description` | `string` | Card description |
| `submitButton` | `string` | Submit button text |
| `submittingButton` | `string` | Text shown while submitting |
| `successTitle` | `string` | Success state title |
| `successDescription` | `string` | Success state description |
| `newIssueButton` | `string` | Button text to submit another issue |
| `descriptionLabel` | `string` | Description field label |
| `descriptionPlaceholder` | `string` | Description field placeholder |

### `callbacks`

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(values) => void` | Called when form is submitted (before webhook) |
| `onSuccess` | `(data) => void` | Called on successful webhook response |
| `onError` | `(error) => void` | Called on submission failure |

### Other Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS class for the wrapper div |
| `disableToaster` | `boolean` | Set `true` if you already have a Sonner `<Toaster />` |

## Theme Customization

The component ships with a dark cyberpunk theme by default. Use `theme.mode: "light"` for a light theme, or override individual CSS variables via the `theme` prop.

For Tailwind CSS users who want to skip the bundled CSS and scan the library's classes with their own config:

```css
/* In your Tailwind CSS entry file */
@source "../node_modules/fix-it-bot-react/dist";
```

## Exports

```ts
// Component
import { FixItBot } from 'fix-it-bot-react'

// Types
import type {
  FixItBotProps,
  FixItBotConfig,
  FixItBotTheme,
  FixItBotLabels,
  FixItBotCallbacks,
} from 'fix-it-bot-react'

// Validation schema (for advanced use)
import { bugReportSchema, type BugReportValues } from 'fix-it-bot-react'
```

## Notes

- The `apiKey` is sent as a Bearer token from the browser. This is standard for webhook tokens, but be aware it is client-visible.
- Your Kilo webhook endpoint must allow CORS from your consumer domain.
- The component includes its own Sonner `<Toaster />` for notifications. Pass `disableToaster` if you already have one.

## License

MIT
