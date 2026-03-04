---
description: How to clone huntban-client and build desktop binaries
---

# Build Desktop Workflow

This workflow automates the process of cloning the `huntban-client` repository from GitLab using a secure token and then executing the Tauri build process.

## Prerequisites

1. Ensure you have a valid **GitLab Personal Access Token** with `read_repository` permissions.
2. Add the token to the `.env` file in the root of `huntban-desktop`:
   ```bash
   GITLAB_TOKEN=your_token_here
   ```

## Steps

// turbo

1. Load the token and clone the repository:
   ```bash
   source .env && git clone https://oauth2:$GITLAB_TOKEN@gitlab.com/jholarck/huntban-client.git
   ```

// turbo 2. Make the build script executable:

```bash
chmod +x build-client.sh
```

// turbo 3. Run the build process:

```bash
./build-client.sh
```

## Artifacts

The generated installers (DMG for Mac, MSI/EXE for Windows) will be located in:
`huntban-client/src-tauri/target/release/bundle`
