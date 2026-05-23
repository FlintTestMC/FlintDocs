---
title: Environment Variables
description: Environment variables used by Flint tools
sidebar:
  order: 12
---

## flint-core

| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_PATH` | `./test` | Base directory for Flint JSON test files |
| `INDEX_NAME` | `.cache/index.json` | Path to the generated test index |
| `DEFAULT_TAG` | `default` | Tag assigned to tests that do not declare tags |

## flint-steel

`flint-steel` reads `.env` via `dotenvy` and then applies `flint.toml` defaults. Environment variables take priority.

| Variable | Example | Description |
|----------|---------|-------------|
| `FLINT_TEST` | `FLINT_TEST=water_falling_state` | Run one test whose file stem exactly matches the value |
| `FLINT_PATTERN` | `FLINT_PATTERN="water*"` | Run tests whose file stem matches a simple `*` glob |
| `FLINT_TAGS` | `FLINT_TAGS=redstone,water` | Run tests matching comma-separated tags |
| `FLINT_VIZ_URL` | `FLINT_VIZ_URL=http://localhost:7878` | Base URL used for printed flint-viz failure links |

Filter priority is:

1. `FLINT_TEST`
2. `FLINT_PATTERN`
3. `FLINT_TAGS`
4. `flint.toml` `implemented_only`
5. `flint.toml` `[filter.tags]`
6. all tests

## flint.toml

Persistent filters can live in `flint.toml`:

```toml
viz_url = "http://localhost:7878"

[filter]
implemented_only = true
test = "place_fence"
pattern = "fence*"

[filter.tags]
redstone = true
walls = false
```

`implemented_only` builds a tag list from Steel's non-default block and item behavior registries.

## JetBrains Plugin

The Flint Testing Suite writes the same variables into launched `flint-steel` Cargo processes. In selected-test mode, run configuration overrides win over global settings; in all-tests mode the plugin removes `FLINT_TEST`, `FLINT_TAGS`, and `FLINT_PATTERN`.
