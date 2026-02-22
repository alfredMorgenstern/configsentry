# Public repo tests

This folder contains *only* reports from running ConfigSentry against public repositories.

Safety policy:
- Repos are treated as untrusted.
- We do **not** execute any code from them (no npm install, no scripts).
- We only clone and run ConfigSentry against docker-compose/compose YAML files.
- After testing, the cloned repo folder is deleted.
