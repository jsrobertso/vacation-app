# Contributor Guidelines for vacation-app

## Overview
This repository contains a fullstack Vacation Request Management System. The backend is Node.js/Express with an optional MongoDB layer and the frontend is React. Start scripts (`run.sh` and `run-simple.sh`) handle dependency installation and port cleanup. Tests use Jest and Supertest.

## Coding Style

### JavaScript / React
- Indent with **2 spaces**.
- Use **single quotes** for strings and include semicolons.
- Prefer `const`/`let` over `var`.
- Keep components and modules small and self-contained.

### Shell Scripts
- Begin with `#!/bin/bash`.
- Indent with **4 spaces**.
- Provide clear `echo` output (emojis are welcome).
- Include error checking and fallback logic similar to the existing `kill_port` function.

## Commit Messages
- Use short, imperative summaries (e.g., `fix: handle missing env vars`).
- Keep the first line under 50 characters.

## Testing Requirements
Run the following from the repository root before committing:

```bash
npm test --silent
./run.sh > /tmp/run_output.txt && ./stop.sh
./run-simple.sh > /tmp/run_simple_output.txt && ./stop.sh
```

Both scripts must start and stop without errors and the Jest suite must pass.

## Other Notes
- Do **not** commit `node_modules`, log files, or other locally generated artifacts.
- Use the project-local `.npm-cache` as configured in `run.sh`.
- If MongoDB models or seed data are modified, verify that `node seed.js` still works.
