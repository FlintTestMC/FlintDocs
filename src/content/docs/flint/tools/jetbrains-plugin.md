---
title: JetBrains Plugin
description: Flint Testing Suite for RustRover and JetBrains IDEs
sidebar:
  order: 6
---

The Flint Testing Suite integrates `flint-steel` and FlintViz into RustRover and other JetBrains IDEs with Rust support. It manages a local `flint-steel` checkout, exposes Flint environment settings, and delegates runs to the Rust plugin's Cargo runner.

## Requirements

- RustRover or another JetBrains IDE with the Rust plugin.
- A Rust and Cargo toolchain visible to the IDE process.
- Access to the configured `flint-steel` repository.
- A SteelMC or Flint-compatible Rust workspace when using run/debug configurations.

The plugin bundles Linux x86-64 and Windows x86-64 helper binaries for `flint-index` and `flint-viz`. Other platforms should provide compatible tools on `PATH` where supported.

## Settings

Open `Settings/Preferences > Tools > Flint`.

| Setting | Environment variable | Purpose |
|---------|----------------------|---------|
| Index file | `INDEX_NAME` | Test index written by `flint-index` |
| Default tag | `DEFAULT_TAG` | Tag for tests without tags |
| Test path | `TEST_PATH` | Flint JSON test directory |
| Test name | `FLINT_TEST` | Single-test filter |
| Tags | `FLINT_TAGS` | Comma-separated tag filter |
| Pattern | `FLINT_PATTERN` | Simple `*` pattern filter |
| Visualizer URL | `FLINT_VIZ_URL` | Base URL for flint-viz failure links |

The tag picker is searchable. `Refresh tags` runs the bundled `flint-index` against `TEST_PATH` and populates the selector from the generated index.

If the raw `FLINT_TAGS` field is non-empty it overrides selected tags. Otherwise, checked tags are joined and passed as `FLINT_TAGS`.

## Flint Run Configuration

Create a `Flint` run configuration to run `flint-steel` tests.

| Mode | Behavior |
|------|----------|
| Selected | Applies `FLINT_TEST`, `FLINT_TAGS`, or `FLINT_PATTERN` from the run configuration, then global settings |
| All | Removes `FLINT_TEST`, `FLINT_TAGS`, and `FLINT_PATTERN` so every test runs |

Run uses the `dev` Cargo profile. Debug uses the custom `flint` profile and delegates to the Rust plugin's LLDB support. The plugin attaches the managed `flint-steel` checkout as a Cargo project and writes Cargo patch configuration when a local `flint-core` override is configured.

Run-configuration filter precedence is:

1. Explicit run-configuration text fields
2. Run-configuration selected tags
3. Global Flint settings
4. `.env` and `flint.toml` handled by `flint-steel`

When `FLINT_VIZ_URL` is blank, the run configuration derives it from the selected or first `Flint Viz` run configuration, falling back to `http://127.0.0.1:7878`.

## Flint Viz Run Configuration

Create a `Flint Viz` run configuration to start the local visualizer.

| Mode | Behavior |
|------|----------|
| Test folder | Serves the open project's `TEST_PATH` directory |
| Readonly | Starts the server without a test folder, useful for opening embedded failure links |

The configuration validates the host and port before launch. If the port is already in use, it fails without killing the existing process.

## Managed Files

The managed `flint-steel` checkout lives under the IDE system directory in `flint-plugin/flint-steel`. The plugin also stores its generated index under `flint-plugin/.cache/index.json` by default.

On uninstall, the plugin marks its managed directory for cleanup and stops FlintViz processes it launched.
