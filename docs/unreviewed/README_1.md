# Build and lint logs

This folder holds captured output from lint and build. **Use it to fix all errors before running the app**: run the log scripts until both lint and build report no errors.

- **lint.log** – output of `npm run lint`
- **build.log** – output of `npm run build`

Logs are overwritten each time you run the capture scripts. The `logs/` directory is in `.gitignore` and is not committed.

## Capturing logs

```bash
# Lint only (writes to logs/lint.log and prints to terminal)
npm run log:lint

# Build only (writes to logs/build.log and prints to terminal)
npm run log:build

# Both (lint then build)
npm run log:lint && npm run log:build
```

## Current status

After the last run:

- **Lint**: 0 errors, 0 warnings (exit 0)
- **Build**: success (exit 0)

You can run the app with `npm run dev` or `npm start`.
