# Fix It Bot - Automated Bug Fixing with Kilo Cloud Agents

## Project Overview
A self-service bot where developers submit bug reports via a simple web form → webhook triggers Kilo Cloud Agent → agent analyzes repo, fixes bug, and creates pull request.

## Kilo League Challenge #1 Entry
**Challenge:** Build coolest automation with Kilo Cloud Agents + Webhooks
**Prize:** $500 of Kilo Credits (Challenge 1) + $50k grand prize at year end
**Entry URL:** https://kilo.codes/league1

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Frontend  │  POST  │  Kilo Webhook   │  Triggers│  Cloud Agent │
│   Form      │────────▶│  Endpoint        │─────────▶│  (Repo +    │
└─────────────┘         └──────────────────┘         │   Analysis) │
                                                        └──────┬────┘
                                                               │
                                                               ▼
                                                        ┌─────────────┐
                                                        │   GitHub    │
                                                        │   PR        │
                                                        └─────────────┘
```

## Components

### 1. Frontend Form (Next.js + Tailwind)
**URL:** Will be deployed to Vercel

**Fields:**
- Repository URL (required) - format: `github.com/user/repo` or full URL
- Branch/commit SHA (required) - which version has the bug
- Bug description (required, multiline) - error message, expected behavior, reproduction steps
- Priority (optional, select) - Critical, High, Medium, Low
- Language hint (optional, select) - TypeScript, Python, JavaScript, Go, etc.

**Features:**
- Validation for GitHub repo format
- Loading states during submission
- Success message with PR link (when agent completes)
- Copyable webhook URL for advanced users
- Dark theme, polished UI (invoke frontend-design skill)

### 2. Kilo Cloud Agent Setup

**Webhook Configuration:**
- Trigger type: HTTP POST
- Prompt template with variables:
  ```
  Analyze the following bug report and fix it:

  Repository: {{bodyJson.repoUrl}}
  Branch/SHA: {{bodyJson.branchSha}}
  Bug Description:
  {{bodyJson.description}}

  Priority: {{bodyJson.priority}}

  Tasks:
  1. Clone the repository
  2. Read relevant code files
  3. Analyze the bug and identify root cause
  4. Generate a fix
  5. Run tests if available
  6. Create a pull request with:
     - Clear title starting with "[Fix]"
     - Detailed description of the bug and fix
     - Before/after comparison if applicable
     - Any testing notes

  Be thorough but efficient. If tests fail, describe why and suggest next steps.
  ```

**Agent Environment Profile:**
- Name: `fix-it-bot`
- Secrets: `GITHUB_TOKEN` (for creating PRs)
- Startup command: `gh auth status || gh auth setup-git` (ensure authenticated)

### 3. Workflow

**User Experience:**

1. Developer finds a bug in their repo
2. Opens Fix It Bot form
3. Fills in:
   - Repo: `facebook/react`
   - Branch: `main`
   - Bug: "Button component not rendering on iOS Safari"
   - Priority: High
4. Clicks "Fix My Bug"
5. Form sends POST to Kilo webhook
6. Kilo Cloud Agent wakes up:
   - Clones `facebook/react`
   - Finds button component
   - Analyzes iOS Safari issue
   - Generates fix
   - Creates PR: "[Fix] Button not rendering on iOS Safari"
7. Form shows success: "Bug fixed! View PR: #12345"

---

## Technical Implementation

### Frontend Stack
- **Framework:** Next.js 15, App Router
- **Styling:** Tailwind CSS + shadcn/ui (invoke frontend-design skill)
- **Deployment:** Vercel (serverless)

### Form Validation
```typescript
interface BugReport {
  repoUrl: string;
  branchSha: string;
  description: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  language?: string;
}

// Validate GitHub repo format
function isValidGitHubRepo(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+/.test(url) ||
         /^[\w-]+\/[\w-]+$/.test(url);
}
```

### Webhook Payload
```json
{
  "repoUrl": "github.com/user/repo",
  "branchSha": "main",
  "description": "Bug description here...",
  "priority": "high",
  "timestamp": "2026-02-05T02:45:00Z"
}
```

### Kilo Webhook Setup (Manual)
User configures webhook at: https://app.kilo.ai/cloud/webhooks

**Webhook URL:** Need to deploy frontend first, get webhook URL from Kilo

---

## Features & Innovations

### Why This Is Cool

1. **Self-Service:** No human intervention after setup
2. **Multi-Language:** Works with any public GitHub repo
3. **Template Variables:** Uses `{{bodyJson}}` for structured data
4. **Profile-Based:** Separate env profiles for different languages
5. **Queue System:** Handles up to 20 concurrent fix requests
6. **Auto-PR:** Agent commits and creates PR directly to user's repo

### Security Considerations

1. **Repo Access:** Works with public repos only (for safety)
2. **Prompt Injection:** Bug description is user input, but only used in agent prompt
3. **Rate Limiting:** Kilo's webhook limits (20 concurrent, 100 retained)
4. **Branch Isolation:** Each webhook session gets its own branch

---

## Success Criteria

### MVP
- [ ] Frontend form deployed to Vercel
- [ ] Kilo webhook configured and tested
- [ ] Agent successfully clones a test repo
- [ ] Agent analyzes and fixes a simple bug
- [ ] Agent creates PR with fix
- [ ] Entry submitted to kilo.codes/league1

### Stretch Goals
- [ ] History of bug fixes (show recent "Fixes" on homepage)
- [ ] Language-specific agent profiles (Python profile, JS profile, etc.)
- [ ] Progress indicator (form polls agent for status)
- [ ] Email notification when PR is ready
- [ ] Support for GitLab (in addition to GitHub)

---

## Entry to Kilo League

**Submit via:** https://kilo.codes/league1

**Required in submission:**
- Live demo URL (Vercel deployment)
- GitHub repo with source code
- Video or screenshots showing it in action
- Brief description of how it works

**Marketing Copy for Entry:**
> "Fix It Bot: A self-service bug fixing automation. Submit bug reports via web form → Kilo Cloud Agent analyzes repo, fixes bug, and creates PR automatically. Uses webhook triggers with template variables ({{bodyJson}}) and agent environment profiles. Works with any public GitHub repo!"

---

## Files Structure

```
fix-it-bot/
├── app/
│   ├── page.tsx (main form)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn)
│   ├── BugReportForm.tsx
│   ├── RepoInput.tsx
│   ├── DescriptionTextarea.tsx
│   └── SuccessState.tsx
├── lib/
│   ├── webhook-client.ts (POST to Kilo webhook)
│   └── validation.ts
├── SPEC.md
└── README.md
```

---

**Instruction for AI/Developers:**
Invoke frontend-design skill for the form UI. This needs distinctive, polished design that avoids generic AI aesthetics. Think "developer-focused, clean, modern" with subtle animations and clear CTAs.
