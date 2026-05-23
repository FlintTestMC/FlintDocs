---
title: FlintViz
description: Local visualizer for Flint test JSON files and failure links
sidebar:
  order: 5
---

FlintViz is a local web UI for inspecting Flint JSON tests. It shows the source JSON, a 3D block view, a timeline scrubber, inventory state, assertions, and source links in one split view.

Use it when you want to understand a test's shape without starting a Minecraft server.

## Installation

Build a self-contained binary from source:

```bash
git clone https://github.com/FlintTestMC/FlintViz
cd FlintViz
cargo xtask build
./target/x86_64-unknown-linux-gnu/release/flint-viz serve ./path/to/tests --open
```

Or install with Cargo:

```bash
cargo install --git https://github.com/FlintTestMC/FlintViz \
  --features embed-frontend \
  flint-viz
```

The embedded frontend build needs Node.js and npm on `PATH`.

## Usage

```bash
flint-viz serve <PATH>
```

| Option | Description |
|--------|-------------|
| `<PATH>` | Directory scanned recursively for Flint JSON tests; defaults to the current directory |
| `--host <IP>` | Bind address; default `127.0.0.1` |
| `--port <N>` | Bind port; default `7878` |
| `--open` | Open the browser after startup |

Open `http://localhost:7878`, select a test in the sidebar, and scrub through the timeline.

## Interactive Links

- Timeline markers reveal the matching `timeline[N]` entry in the editor.
- Clicking a rendered block reveals the source entry that placed or last changed it.
- Moving the editor cursor inside a timeline entry highlights matching ticks.
- Assertion rows reveal the source entry and can move the camera to the asserted position.

## Minecraft Assets

The 3D renderer uses vanilla Minecraft models and textures. They are not committed to the repository. Generate the local asset bundle once:

```bash
cd frontend
npm install
npm run assets
```

The script downloads the official client jar, verifies it, extracts only block and item assets, and writes `frontend/public/mc-assets.zip`.

## Failure Links

`flint-steel` prints `Open in flint-viz:` links for failed tests. The base URL comes from `FLINT_VIZ_URL`, then `flint.toml` `viz_url`, then `http://localhost:7878`.

Start FlintViz first:

```bash
flint-viz serve ./test --open
```

Then run `flint-steel`; failed assertions can be opened directly in the visualizer with the failing test spec and assertion payload embedded in the URL.

## Limitations

- FlintViz performs static replay of the test spec. It does not simulate full Minecraft game logic.
- It does not replace FlintCLI or flint-steel execution.
- Recording is handled by FlintCLI interactive mode, not by FlintViz.
