# Flowency Portal - Client Collaboration Platform

**Status:** Tactical MVP (Weekend Build)
**Purpose:** Enable clients to collaborate on PRD markdown documents via magic link authentication
**Live:** [portal.flowency.co.uk](https://portal.flowency.co.uk) (pending DNS)

---

## Overview

This is the **tactical solution** for the Flowency client portal. It provides:
- Magic link authentication (reusing BNDY backend infrastructure)
- Markdown document editing with live preview
- GitHub-backed version control for client documents
- Simple, fast deployment via GitHub Pages

**This is a tactical MVP.** See `FLOWENCY_PORTAL_PLAN.md` in the FlowencyRebrand repo for the strategic platform roadmap.

---

## Architecture

### Frontend
- **Framework:** Vite + React + TypeScript
- **Routing:** Wouter
- **State Management:** React Query
- **Markdown Editor:** `@uiw/react-md-editor`
- **Styling:** Tailwind CSS
- **Hosting:** GitHub Pages

### Backend (Reuses BNDY Infrastructure)
- **API:** `api.bndy.co.uk`
- **Endpoint:** `GET /api/flowency-invites/{token}`
- **Auth:** Token validation via Lambda + DynamoDB
- **Lambda:** `flowency-invite-lambda` (separate from BNDY business logic)

### Document Storage
- **Repo:** [flowency-live/client-docs](https://github.com/flowency-live/client-docs)
- **Structure:** `/clients/{clientId}/prd.md`
- **Access:** GitHub API via Personal Access Token
- **Version Control:** Built-in via Git commits

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- GitHub Personal Access Token (fine-grained) with:
  - Repo: Read/Write access to `flowency-live/client-docs`

### 2. Installation

```bash
cd C:\VSProjects\Flowency-portal
npm install
```

### 3. Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Add your GitHub token:

```
VITE_GITHUB_TOKEN=github_pat_xxxxx
```

### 4. Local Development

```bash
npm run dev
```

Visit http://localhost:5173

### 5. Building

```bash
npm run build
```

Output: `dist/` folder

---

## Usage

### Creating a Client Invite

**Current Process (Manual):**

1. Add client document to `flowency-live/client-docs`:
   ```
   /clients/
     /ninerops/
       prd.md
   ```

2. Create invite token in DynamoDB (via AWS Console or script):
   ```json
   {
     "PK": "INVITE#abc-123-def",
     "SK": "METADATA",
     "token": "abc-123-def",
     "clientId": "ninerops",
     "clientName": "NinerOps",
     "status": "active",
     "expiresAt": 1234567890
   }
   ```

3. Generate magic link:
   ```
   https://portal.flowency.co.uk/invite/abc-123-def
   ```

4. Send link to client via WhatsApp/email

### Client Experience

1. Client clicks magic link
2. Portal validates token via BNDY API
3. If valid, redirects to `/prd` page
4. Client can view/edit markdown document
5. Changes are committed to GitHub when saved
6. You receive GitHub notification of changes

---

## Project Structure

```
src/
├── lib/
│   ├── services/
│   │   ├── api-service.ts      # BNDY API integration
│   │   └── github-service.ts   # GitHub API for docs
│   └── queryClient.ts           # React Query config
├── pages/
│   ├── Invite.tsx               # Magic link validation
│   └── PRD.tsx                  # Document editor
├── App.tsx                      # Main app with routing
├── index.css                    # Tailwind styles
└── main.tsx                     # Entry point
```

---

## Deployment

### GitHub Actions (Automatic)

Pushes to `main` branch trigger automatic deployment:

1. Build runs with `VITE_GITHUB_TOKEN` from GitHub Secrets
2. Artifacts uploaded to GitHub Pages
3. Live at GitHub Pages URL

### DNS Configuration

Add CNAME record:
```
portal.flowency.co.uk → flowency-live.github.io
```

### Required GitHub Secrets

In repo settings → Secrets and variables → Actions:

- `VITE_GITHUB_TOKEN`: GitHub PAT for accessing client-docs repo

---

## Backend Lambda (BNDY)

### Function: `flowency-invite-lambda`

**Purpose:** Validate invite tokens for Flowency clients (separate from BNDY invites)

**Location:** `bndy-serverless-api/functions/flowency-invite-lambda/`

**Endpoint:** `GET /api/flowency-invites/{token}`

**Response:**
```json
{
  "token": "abc-123-def",
  "clientId": "ninerops",
  "clientName": "NinerOps",
  "status": "active",
  "expiresAt": 1234567890
}
```

---

## Limitations (Tactical Solution)

- No automated email sending (manual copy/paste links)
- No admin dashboard (manual DynamoDB management)
- No multi-document support (single `prd.md` per client)
- GitHub token in frontend env vars (not ideal security)
- Single subdomain for all clients
- No real-time collaboration
- No comment/feedback system

**These will be addressed in the strategic solution next week!**

---

## Troubleshooting

### Build Fails
- Check Node version (need 18+)
- Verify `VITE_GITHUB_TOKEN` is set
- Run `npm install` to ensure all deps installed

### Can't Save Documents
- Verify GitHub token has write access to `client-docs` repo
- Check browser console for API errors
- Verify file exists at `clients/{clientId}/prd.md`

### Invite Token Invalid
- Check token exists in DynamoDB
- Verify Lambda endpoint is deployed and accessible
- Check CloudWatch logs for Lambda errors

---

## Next Steps

**Immediate:**
- [ ] Create `flowency-invite-lambda` in BNDY backend
- [ ] Setup first client (NinerOps) in client-docs repo
- [ ] Generate test invite token
- [ ] Deploy and test end-to-end
- [ ] Configure DNS for `portal.flowency.co.uk`

**Strategic (Next Week):**
- [ ] Build admin dashboard at `operations.flowency.co.uk`
- [ ] Migrate to separate Cognito pool
- [ ] Move documents to S3 + DynamoDB
- [ ] Implement wildcard subdomains (`{client}.flowency.co.uk`)
- [ ] Add version history, comments, multiple documents

---

## Links

- **Main Flowency Site:** [www.flowency.co.uk](https://www.flowency.co.uk)
- **GitHub Repo:** [flowency-live/portal](https://github.com/flowency-live/portal)
- **Client Docs Repo:** [flowency-live/client-docs](https://github.com/flowency-live/client-docs)
- **BNDY Backend:** `api.bndy.co.uk`

---

**Built with:** Vite + React + TypeScript
**Deployed with:** GitHub Pages
**Managed by:** Flowency Team
