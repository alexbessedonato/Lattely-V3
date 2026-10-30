# Lattely

## Code conventions

- No `index.ts` files and no barrels: every import names the real file (`@/db/client`, not `@/db`), so you always know which file to open.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for alexbessedonato/Lattely-V3, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
