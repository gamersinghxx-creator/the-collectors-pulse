@AGENTS.md

# Working rules for this project (and the user's standing preferences)

These rules are set by the user and apply to every session on this project. They mirror
the user's global preferences — keep them in sync if the global file changes.

## 1. Always maintain the three living documents
Create (if missing) and **keep updated after every fix or substantial change**:
- **HANDOFF.md** — where we are, where we left off, what's in progress, how to resume.
  So another AI can pick up seamlessly.
- **PROJECT_REPORT.md** — complete technical understanding of the project (architecture,
  data flow, status, limitations).
- **PROJECT_BIBLE.md** — the definitive guide, usable by **both AI and humans**
  (product, setup, deploy, conventions, troubleshooting).

Update the relevant file(s) whenever something meaningful changes — don't let them go stale.

## 2. Commit (and push) after every fix / substantial change
- After any main fix or substantial work, **stage + commit** all changes to `main` with a
  clear message, and **push** to the Git remote.
- Repo: `https://github.com/gamersinghxx-creator/the-collectors-pulse.git` (remote `origin`).
- If a repo/remote is missing on a future project, **ask the user to create it and share the
  link** before continuing the commit/push routine.
- Note on environment: commits can be authored here, but the actual `git push` may require the
  user's credentials — if push can't be performed automatically, commit and tell the user the
  exact one-line `git push` to run.

## 3. Never commit secrets
`.env.local` and any keys/tokens stay out of git (already git-ignored). Verify before committing.
