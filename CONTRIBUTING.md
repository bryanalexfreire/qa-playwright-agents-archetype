# Contributing

## Branching model: Git flow

| Branch | Purpose | Created from | Merges into |
|---|---|---|---|
| `main` | Released, tagged versions only | — | — |
| `develop` | Integration of finished work | `main` (once) | `release/*` |
| `feature/<short-name>` | New tests, agents, skills, page objects | `develop` | `develop` (PR) |
| `release/<x.y.z>` | Stabilise a version: docs, version bump, fixes only | `develop` | `main` (PR + tag) and back into `develop` |
| `hotfix/<x.y.z>` | Urgent fix of a released version | `main` | `main` (PR + tag) and `develop` |

### Typical commands
```bash
# start
git checkout develop && git pull
git checkout -b feature/pay-screen-tests

# finish (open a PR to develop)
git push -u origin feature/pay-screen-tests

# release
git checkout develop && git pull
git checkout -b release/0.2.0
# bump "version" in package.json, update CHANGELOG.md, PR to main
git checkout main && git pull && git tag v0.2.0 && git push origin v0.2.0
git checkout develop && git merge --no-ff main && git push
```

### Rules
- No direct pushes to `main` or `develop`: PRs only, with green CI and one review.
- `release/*` and `hotfix/*` accept fixes only, no new features.
- Delete feature branches after merge.

## Commits: Conventional Commits
`<type>(<scope>): <summary>` — types: `feat`, `fix`, `test`, `docs`, `refactor`, `ci`, `chore`.
Examples: `test(pay): add withdraw state checks`, `feat(agents): add test-healer`, `fix(pages): stable locator for report button`.

## Versioning: SemVer
- MAJOR: breaking change in folder layout, fixtures or agent contracts.
- MINOR: new agents, skills, page objects or test suites.
- PATCH: fixes and docs.

## Definition of done for a PR
- [ ] `npm run typecheck`, `npm run lint:specs` and the affected tests pass locally.
- [ ] New tests follow the test-automation conventions (title with requirement ID, tags, page objects, no hard waits).
- [ ] No credentials, `.env`, `.auth/` or personal data committed.
- [ ] Bugs found are linked (BUG-ID / tracker key) and have a spec in `tests/bugs/`.
