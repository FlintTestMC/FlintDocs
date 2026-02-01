---
title: Test Format Overview
description: Structure and layout of Flint test files
sidebar:
  order: 1
---

Flint tests are JSON files with a defined structure. This page explains the basic layout.

## Basic Structure

```json
{
  "flintVersion": "0.1.0",
  "name": "Test Name",
  "description": "Optional description",
  "tags": ["unit", "redstone"],
  "dependencies": [],
  "setup": {
    "cleanup": {
      "region": [[0, 0, 0], [14, 10, 14]]
    },
    "player": { ... }
  },
  "timeline": [ ... ],
  "breakpoints": [5, 10]
}
```

## Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the test (shown in output) |
| `setup` | object | Test configuration with cleanup region |
| `timeline` | array | List of actions |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `flintVersion` | string | - | Flint version for compatibility |
| `description` | string | - | Detailed description |
| `tags` | string[] | `["default"]` | Tags for filtering |
| `dependencies` | string[] | `[]` | Tests that must run first |
| `breakpoints` | number[] | `[]` | Ticks for debug pause |

## Setup Section

The setup section configures the test environment.

### Cleanup Region (Required)

```json
{
  "setup": {
    "cleanup": {
      "region": [[minX, minY, minZ], [maxX, maxY, maxZ]]
    }
  }
}
```

**Constraints:**
- Maximum width (X): 15 blocks
- Maximum height (Y): 384 blocks
- Maximum depth (Z): 15 blocks
- All positions in the timeline must be within this region

### Player Configuration (Optional)

```json
{
  "setup": {
    "cleanup": { "region": [[0,0,0], [5,5,5]] },
    "player": {
      "inventory": {
        "hotbar1": { "item": "minecraft:diamond_axe", "count": 1 },
        "hotbar2": { "item": "minecraft:honeycomb", "count": 64 },
        "off_hand": { "item": "minecraft:shield", "count": 1 }
      },
      "selectedHotbar": 1
    }
  }
}
```

**Available Slots:**

| Slot | Description |
|------|-------------|
| `hotbar1` - `hotbar9` | Hotbar slots |
| `off_hand` | Off-hand |
| `helmet` | Helmet |
| `chestplate` | Chestplate |
| `leggings` | Leggings |
| `boots` | Boots |

## Timeline Section

The timeline is an array of actions executed at specific ticks.

```json
{
  "timeline": [
    { "at": 0, "do": "place", ... },
    { "at": 5, "do": "assert", ... }
  ]
}
```

### Tick Specification

Actions can execute at one or multiple ticks:

```json
// Single tick
{ "at": 5, "do": "place", ... }

// Multiple ticks (action repeats)
{ "at": [0, 5, 10], "do": "assert", ... }
```

## Block Specification

Blocks can be defined with properties in two formats:

### Flat Properties

```json
{
  "id": "minecraft:lever",
  "powered": false,
  "face": "floor",
  "facing": "north"
}
```

### Nested Properties

```json
{
  "id": "minecraft:lever",
  "properties": {
    "powered": "false",
    "face": "floor",
    "facing": "north"
  }
}
```

Both formats produce the same block state:
```
minecraft:lever[powered=false,face=floor,facing=north]
```

### Property Value Types

- **Strings:** `"north"`, `"side"`, `"floor"`
- **Booleans:** `true`, `false`
- **Numbers:** `15`, `0`

## Tags

Tags enable filtering and grouping of tests.

```json
{
  "tags": ["redstone", "unit", "fast"]
}
```

Tests without tags are automatically assigned to the `default` tag.

### Example Tag Conventions

| Tag | Usage |
|-----|-------|
| `unit` | Single behavior tests |
| `integration` | Multi-system tests |
| `regression` | Tests for fixed bugs |
| `slow` | Tests with many ticks |
| `redstone` | Redstone mechanics |
| `piston` | Piston behavior |

## Validation

Flint automatically validates tests when loading:

1. **Setup present** - `setup.cleanup.region` must exist
2. **Region valid** - min ≤ max for all coordinates
3. **Dimensions check** - Region not larger than allowed
4. **Positions check** - All timeline positions within region

Errors are reported with file, line, and column:
```
tests/my-test.json:15:8: Position [20,0,0] is outside cleanup region
```
