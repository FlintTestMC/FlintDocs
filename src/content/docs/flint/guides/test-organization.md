---
title: Test Organization
description: How to structure and organize your tests
sidebar:
  order: 4
---

Good test organization makes tests maintainable, discoverable, and reusable.

## Directory Structure

### By Category

```
tests/
├── redstone/
│   ├── signal/
│   │   ├── strength-decay.json
│   │   └── boosting.json
│   ├── repeater/
│   │   ├── delay-1-tick.json
│   │   ├── delay-4-tick.json
│   │   └── lock.json
│   ├── comparator/
│   │   ├── compare-mode.json
│   │   └── subtract-mode.json
│   └── observer/
│       └── block-detection.json
├── blocks/
│   ├── copper/
│   │   ├── waxing.json
│   │   ├── unwaxing.json
│   │   └── oxidation.json
│   ├── wood/
│   │   └── stripping.json
│   └── falling/
│       ├── sand-falls.json
│       └── gravel-falls.json
├── pistons/
│   ├── pushing.json
│   ├── pulling.json
│   └── push-limit.json
└── player/
    └── inventory.json
```

### By Mechanic

```
tests/
├── block-updates/
├── tick-scheduling/
├── entity-physics/
└── player-interactions/
```

## Naming Conventions

### File Names

```
[what]-[action]-[details].json
```

**Examples:**
- `redstone-signal-loses-strength.json`
- `copper-gets-waxed.json`
- `repeater-delay-4-ticks.json`
- `piston-doesnt-push-13-blocks.json`

### Test Names

```json
{
  "name": "Redstone signal loses 1 strength per block"
}
```

**Rules:**
- Describes the expected behavior
- Starts with the element being tested
- Precise and specific

## Tag System

### Tag Hierarchy

```
├── unit          # Single behavior tests
├── integration   # Multi-system tests
├── regression    # Tests for fixed bugs
│
├── redstone
│   ├── signal
│   ├── repeater
│   ├── comparator
│   └── observer
├── piston
├── copper
├── wood
│
├── fast          # < 10 ticks
├── slow          # > 100 ticks
└── timing        # Timing-critical
```

### Tags in Tests

```json
{
  "name": "Repeater 4-tick delay",
  "tags": ["unit", "redstone", "repeater", "timing"]
}
```

### Filtering by Tags

```rust
// Only redstone tests
let files = loader.collect_by_tags(&["redstone".to_string()])?;

// Only fast unit tests
let files = loader.collect_by_tags(&["unit".to_string(), "fast".to_string()])?;
```

## Test Suites

### Smoke Tests

Quick tests for basic functionality:

```
tests/smoke/
├── block-placement.json
├── redstone-basic.json
└── player-inventory.json
```

```json
{
  "name": "Smoke: Block placement works",
  "tags": ["smoke", "fast"],
  "timeline": [
    { "at": 0, "do": "place", "pos": [0,0,0], "block": {"id": "minecraft:stone"} },
    { "at": 1, "do": "assert", "checks": [{"pos": [0,0,0], "is": {"id": "minecraft:stone"}}] }
  ]
}
```

### Regression Tests

Tests for fixed bugs:

```json
{
  "name": "Regression #42: Observer doesn't trigger twice",
  "description": "Fixes: https://github.com/org/repo/issues/42",
  "tags": ["regression", "observer"]
}
```

## Documentation in Tests

### Using Description

```json
{
  "name": "Comparator Subtract Mode",
  "description": "Verifies that the comparator in subtract mode subtracts the side signal strength from the rear. Setup: Rear input = 15, side input = 10. Expected: Output = 5."
}
```

### For Complex Tests

```json
{
  "name": "Piston BUD (Block Update Detector)",
  "description": "Tests quasi-connectivity for pistons. Setup: Piston at [0,0,0] facing east. Redstone block at [0,2,0] (2 above piston). Expected: Piston should NOT extend (no direct power). After block update it should extend."
}
```

## Index System

Flint automatically creates an index of all tests:

```json
// .cache/index.json
{
  "hash": 8180331397721424639,
  "index": {
    "redstone": [
      "./tests/redstone/signal/strength.json",
      "./tests/redstone/repeater/delay.json"
    ],
    "copper": [
      "./tests/blocks/copper/waxing.json"
    ],
    "default": [
      "./tests/untagged-test.json"
    ]
  }
}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_PATH` | `./test` | Base directory |
| `INDEX_NAME` | `.cache/index.json` | Index file |
| `DEFAULT_TAG` | `default` | Tag for untagged tests |

## Example: Complete Suite

```
minecraft-tests/
├── .cache/
│   └── index.json
├── smoke/
│   ├── basic.json
│   └── redstone.json
├── unit/
│   ├── redstone/
│   │   ├── wire/
│   │   │   ├── power-decay.json
│   │   │   └── connections.json
│   │   └── repeater/
│   │       ├── delay-1.json
│   │       ├── delay-2.json
│   │       ├── delay-3.json
│   │       └── delay-4.json
│   └── blocks/
│       └── copper/
│           ├── waxing.json
│           └── oxidation.json
├── integration/
│   └── piston-door.json
└── regression/
    ├── issue-42-observer.json
    └── issue-57-repeater-lock.json
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Flint Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Smoke Tests
        run: cargo run -- --tags smoke

      - name: Run Unit Tests
        run: cargo run -- --tags unit

      - name: Run All Tests
        run: cargo run -- --all
```

### Test Results

```bash
# Concise output
cargo run -- --format concise

# JUnit XML for CI
cargo run -- --format junit > test-results.xml

# JSON for processing
cargo run -- --format json > results.json
```
