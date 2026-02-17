# Sidehustle Sprints — 2026-02-16

Goal for today: pick one app idea with exit potential (fits Kompetenzen, avoids Hauptjob competition, minimizes need for outbound sales/marketing), then build an MVP by evening.

## Sprint Plan (today)

### Sprint 0 — Project setup (now → ~13:00)
- [ ] Pull latest vault changes (done)
- [ ] Read notes: Nebengewerbe-Ziele, Kompetenzen, Defizite, Hauptjob, Projekthistorie (done)
- [ ] Create project folder + docs scaffold (in progress)
- [ ] Decide on 1 concept + MVP scope

### Sprint 1 — Concept & validation-lite (~13:00 → 15:00)
- [ ] Problem statement + target users
- [ ] Why now + differentiation
- [ ] MVP definition (must ship today)
- [ ] Pricing hypothesis + distribution channel
- [ ] Risks (esp. marketing/sales) + mitigations

### Sprint 2 — MVP scaffold (~15:00 → 17:00)
- [ ] Repo scaffold (package.json, tsconfig, lint, tests)
- [ ] Minimal CLI/UI skeleton + example flow

### Sprint 3 — Core feature (~17:00 → 19:30)
- [ ] Implement 1–2 “killer” checks
- [ ] Output format + autofix hints

### Sprint 4 — Packaging (~19:30 → evening)
- [ ] README (install, run, examples)
- [ ] Demo inputs + screenshots/recording notes
- [ ] Next steps backlog

## Working log

- 12:29: Pulled wissen_mmo; new `Marius/` folder exists.
- 12:40: Chose concept: **ConfigSentry** (Compose security/ops linter) + wrote CONCEPT.md.
- 12:55: MVP CLI scaffolded (TypeScript + yaml parser) + example compose file; CLI returns exit code 2 when findings exist (CI-friendly).
- 12:58: Added minimal unit tests for key rules; `npm test` green.
- 17:03: Re-ran tests; still green.
