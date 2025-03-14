# Migration Scripts

This directory contains scripts to help with the migration from Vite to Next.js.

## Available Scripts

### `replace-vite-with-next.sh`

This script handles the complete replacement of the Vite implementation with the Next.js implementation. It:

1. Creates a backup of the existing Vite implementation
2. Removes the Vite implementation
3. Copies the Next.js implementation to the target directory
4. Updates root package.json scripts (if applicable)

#### Usage

```bash
cd /Users/maxvaljan/maxmove-monorepo-next
./temp-repo/frontend/web-ui-next/scripts/replace-vite-with-next.sh
```

### `remove-vite-files.sh`

This script identifies and removes Vite-specific files from the repository. Use this if you only want to clean up the Vite implementation without replacing it.

#### Usage

```bash
cd /Users/maxvaljan/maxmove-monorepo-next
./temp-repo/frontend/web-ui-next/scripts/remove-vite-files.sh
```

### `start-dev-container.sh`

This script builds and runs the Next.js application in a Docker container using development mode. This is particularly useful while the production build issues are being resolved.

#### Usage

```bash
cd /Users/maxvaljan/maxmove-monorepo-next/frontend/web-ui
./scripts/start-dev-container.sh
```

## Migration Process

The recommended migration process is:

1. Complete all testing of the Next.js implementation in development mode
2. Use `replace-vite-with-next.sh` to swap the implementations
3. Verify that the Next.js implementation works correctly
4. Commit the changes to version control

## Safety Measures

- All scripts create a backup of the Vite implementation before making any changes
- The `remove-vite-files.sh` script requires confirmation before deletion
- In case of issues, you can restore from the backup directory

## Next Steps After Migration

After migrating from Vite to Next.js:

1. Update any documentation that references the Vite implementation
2. Update CI/CD pipelines to use the Next.js build process
3. Continue working on resolving the production build issues (see PRODUCTION_BUILD.md)
4. Once production build issues are resolved, replace the development mode Docker deployment with a production build