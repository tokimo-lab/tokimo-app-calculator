# tokimo-app-calculator

Tokimo Calculator — a multi-process app with basic, scientific, and programmer modes.

## Overview

Pure UI app (no database, no external API). Serves static assets via the Tokimo bus data-plane socket.

## Development

```bash
# Build UI
cd ui && pnpm install && pnpm build

# Build Rust binary
cargo build -p tokimo-app-calculator

# Run help
cargo run -p tokimo-app-calculator -- --help
```

## Structure

```
tokimo-app-calculator/
├── tokimo-app.toml   # App manifest (id, window_type, icon, size)
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── app_server.rs  # Axum router + UDS listener
│   ├── assets.rs      # Static asset serving (embed + dev override)
│   ├── cli.rs
│   └── error.rs
└── ui/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── index.tsx          # defineApp entry
        ├── calculator-engine.ts
        └── pages/             # React components
```
