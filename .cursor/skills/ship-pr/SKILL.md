---
name: ship-pr
description: >-
  Ship completed work end-to-end: verify locally, branch, commit, push, open PR,
  wait for CI, merge when green, return to main synced with origin. Use when the
  user says ship it, ship this, land the PR, commit and push, create a PR and
  merge, or after finishing a playbook session/task gate.
disable-model-invocation: true
---

# Ship PR — branch → commit → PR → merge → sync main

Run this **after implementation is done** and local quality gates pass. Executes
the full delivery loop like a senior engineer: small scoped PR, green CI, merge,
clean main.

## When to use

- User finished a task/session and wants it on `main`
- Playbook test gate includes "Commit + push" and merge
- User says: *ship it*, *land this*, *open PR and merge*, *sync main*

## When NOT to use

- Work is incomplete or local tests fail → fix first
- User only asked to commit (no PR) → follow user commit rules only
- Multiple unrelated slices → use `split-to-prs` first, then ship each slice
- CI fails for reasons outside this PR → report; do not weaken CI to pass

## Hard rules (non-negotiable)

- **Never** update git config
- **Never** force-push to `main`/`master`
- **Never** skip hooks (`--no-verify`) unless user explicitly asks
- **Never** commit `.env`, credentials, or secrets — warn if requested
- **Never** `git add .` / `git add -A` — stage only files for this change
- **Never** merge until **all required** PR checks pass
- **Never** amend a commit unless user rules allow (failed hook fix on your
  commit, not pushed, etc.)
- One logical change per PR — see `.cursor/rules/git-workflow.mdc`

## Phase 0 — Pre-flight (local)

1. Confirm implementation matches the task/playbook gate.
2. Run the repo quality gate:

```bash
pnpm turbo run test lint typecheck
```

3. If anything fails → fix, re-run, **stop** (do not branch/commit yet).
4. Inspect working tree:

```bash
git status
git diff
git diff --staged
git log -5 --oneline
```

5. Ensure you are on `main` and reasonably synced:

```bash
git fetch origin
git status   # prefer "up to date with origin/main" before branching
```

## Phase 1 — Branch

1. Branch from latest `main` (pull if behind):

```bash
git checkout main
git pull origin main
git checkout -b <type>/<short-scope>
```

2. **Branch naming** (Conventional Commits style, lowercase, hyphens):
   - `feat/domain-ledger`, `fix/ci-pnpm-version`, `docs/session-playbook`
   - Match scope to one logical change

## Phase 2 — Commit

1. Stage **only** relevant paths (explicit `git add path/to/file …`).
2. Draft message from **actual diff** — focus on **why**, not a file list.
3. Use Conventional Commits with scope when useful:

```
feat(domain-ledger): audit ledger event builder

Add pure createLedgerEvent builder returning schema-validated events for
callers to persist. Injected id/createdAt keep the builder deterministic.
```

4. Commit via HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
<subject line>

<body — why, not what>
EOF
)"
```

5. If pre-commit hook modifies files → fix and **new commit** (do not amend
   unless user amend rules are satisfied).

## Phase 3 — Push & open PR

1. Push and set upstream:

```bash
git push -u origin HEAD
```

2. Gather PR context (parallel):

```bash
git log origin/main..HEAD --oneline
git diff origin/main...HEAD
```

3. Create PR with `gh` (title = commit subject or scoped summary):

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
- <1–3 bullets: why this change exists>

## Test plan
- [x] <commands run locally>
- [ ] <anything reviewer should verify manually, if any>
EOF
)"
```

4. Return the **PR URL** to the user.

## Phase 4 — CI gate (wait, do not merge early)

1. Watch checks until complete:

```bash
gh pr checks <number> --watch --interval 10
```

2. **All required checks pass** → proceed to Phase 5.
3. **Any check fails** → do **not** merge. Loop:
   - Read failure logs (`gh run view`, Actions URL, or CI output)
   - Fix within PR scope on the same branch
   - Push fix commits
   - Re-watch checks until green
4. If failure is clearly unrelated and branch is stale → merge latest `main`
   into the branch, re-run checks. If still blocked, report to user.

For comment/review triage during this loop, prefer the `babysit` skill.

## Phase 5 — Merge & sync main

Only when CI is green **and** the PR is mergeable:

```bash
gh pr merge <number> --merge --delete-branch
git checkout main
git pull origin main
git status
```

- Use `--merge` (merge commit) unless the repo standard is squash/rebase —
  check recent merged PRs on this repo first.
- Confirm: PR state `MERGED`, local `main` matches `origin/main`, working tree
  clean.

## Phase 6 — Report back

Tell the user:

1. PR URL and merge status
2. CI result (which checks ran)
3. Final commit on `main` (`git log -1 --oneline`)
4. Anything left unstaged or deferred

## Quick checklist

Copy and track:

```
Ship PR progress:
- [ ] Local: turbo test lint typecheck green
- [ ] Branch created from synced main
- [ ] Scoped commit(s), no secrets
- [ ] Pushed + PR opened
- [ ] All CI checks passed
- [ ] PR merged, branch deleted
- [ ] main checked out and synced with origin
```

## Related project rules & skills

- `.cursor/rules/git-workflow.mdc` — commit style, PR readiness, scope discipline
- `split-to-prs` — when one task produced multiple independent slices
- `babysit` — when CI/comments need iteration before merge
