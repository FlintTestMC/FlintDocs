---
title: Writing Tests
description: Best practices and patterns for effective Flint tests
sidebar:
  order: 1
---

This guide shows how to write effective and maintainable tests.

## Core Principles

### 1. One Test, One Behavior

Each test should verify exactly one behavior.

**Bad:**
```json
{
  "name": "Redstone works",
  "timeline": [
    // Tests signal strength
    // Tests repeaters
    // Tests comparators
    // Tests lamps
  ]
}
```

**Good:**
```json
{
  "name": "Redstone signal loses 1 strength per block",
  "timeline": [
    // Only signal strength decay
  ]
}
```

### 2. Meaningful Names

The test name should describe the expected behavior.

**Bad:**
- `test1.json`
- `redstone.json`
- `block-test.json`

**Good:**
- `redstone-signal-loses-strength-per-block.json`
- `repeater-4-tick-delay.json`
- `sand-falls-when-support-removed.json`

### 3. Minimal Cleanup Region

Use only as much space as needed.

**Bad:**
```json
{
  "cleanup": {
    "region": [[0, 0, 0], [14, 100, 14]]
  }
}
```

**Good:**
```json
{
  "cleanup": {
    "region": [[0, 0, 0], [5, 2, 0]]
  }
}
```

### 4. Atomic Setup with placeEach

Place all initial blocks in a single tick.

```json
{
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    {
      "at": 1,
      "do": "place",
      "pos": [0, 1, 0],
      "block": { "id": "minecraft:redstone_block" }
    }
  ]
}
```

## Test Structure

### Anatomy of a Test

```
1. Setup (Tick 0)      - Place initial blocks
2. Action (Tick 1+)    - Execute the action being tested
3. Wait (optional)     - Time for processing
4. Assertion           - Verify result
```

### Example: Complete Test

```json
{
  "name": "Lever activates redstone lamp",
  "description": "Verifies that an activated lever turns on a connected lamp",
  "tags": ["redstone", "unit"],
  "setup": {
    "cleanup": {
      "region": [[0, 0, 0], [2, 1, 0]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:redstone_lamp" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:lever", "powered": false } }
      ]
    },
    {
      "at": 0,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:redstone_lamp", "lit": false } }
      ]
    },
    {
      "at": 1,
      "do": "place",
      "pos": [2, 0, 0],
      "block": { "id": "minecraft:lever", "powered": true }
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:redstone_lamp", "lit": true } }
      ]
    }
  ]
}
```

## Using Assertions Effectively

### Only Check Relevant Properties

Only verify the properties that matter for your test.

**Too specific:**
```json
{
  "is": {
    "id": "minecraft:redstone_wire",
    "power": 15,
    "north": "side",
    "south": "side",
    "east": "none",
    "west": "none"
  }
}
```

**Better:**
```json
{
  "is": {
    "id": "minecraft:redstone_wire",
    "power": 15
  }
}
```

### Before-After Assertions

Check state before and after an action.

```json
{
  "timeline": [
    { "at": 0, "do": "place", "pos": [0,0,0], "block": {"id": "minecraft:copper_block"} },

    { "at": 0, "do": "assert", "checks": [
      { "pos": [0,0,0], "is": {"id": "minecraft:copper_block"} }
    ]},

    { "at": 1, "do": "useItemOn", "pos": [0,0,0], "face": "top", "item": "minecraft:honeycomb" },

    { "at": 2, "do": "assert", "checks": [
      { "pos": [0,0,0], "is": {"id": "minecraft:waxed_copper_block"} }
    ]}
  ]
}
```

### Multiple Assertions Over Time

For tests that verify stability:

```json
{
  "at": [10, 20, 30],
  "do": "assert",
  "checks": [
    { "pos": [5, 0, 5], "is": { "id": "minecraft:redstone_lamp", "lit": true } }
  ]
}
```

## Choosing the Right Timing

### Redstone Timing

```json
{
  "timeline": [
    { "at": 0, "do": "placeEach", "blocks": [...] },
    { "at": 1, "do": "place", "pos": [0,0,0], "block": {"id": "minecraft:redstone_block"} },
    { "at": 2, "do": "assert", "checks": [...] }
  ]
}
```

**Rule of thumb:** Assert 1-2 ticks after a redstone change.

### Falling Blocks

Sand/gravel need time to fall:

```json
{
  "timeline": [
    { "at": 0, "do": "placeEach", "blocks": [
      { "pos": [0, 1, 0], "block": { "id": "minecraft:sand" } },
      { "pos": [0, 0, 0], "block": { "id": "minecraft:stone" } }
    ]},
    { "at": 1, "do": "remove", "pos": [0, 0, 0] },
    { "at": 10, "do": "assert", "checks": [
      { "pos": [0, 0, 0], "is": { "id": "minecraft:sand" } }
    ]}
  ]
}
```

### Observer Chains

Observers have 2 game-tick delay:

```json
{
  "timeline": [
    { "at": 0, "do": "placeEach", "blocks": [
      { "pos": [0, 0, 0], "block": { "id": "minecraft:observer", "facing": "east" } },
      { "pos": [1, 0, 0], "block": { "id": "minecraft:observer", "facing": "east" } }
    ]},
    { "at": 1, "do": "place", "pos": [-1, 0, 0], "block": { "id": "minecraft:stone" } },
    { "at": 3, "do": "assert", "checks": [
      { "pos": [0, 0, 0], "is": { "id": "minecraft:observer", "powered": true } }
    ]},
    { "at": 5, "do": "assert", "checks": [
      { "pos": [1, 0, 0], "is": { "id": "minecraft:observer", "powered": true } }
    ]}
  ]
}
```

## Debugging

### Step-by-Step Verification

Add intermediate assertions:

```json
{
  "timeline": [
    { "at": 0, "do": "place", ... },
    { "at": 0, "do": "assert", "checks": [...] },
    { "at": 1, "do": "place", ... },
    { "at": 1, "do": "assert", "checks": [...] },
    { "at": 2, "do": "assert", "checks": [...] }
  ]
}
```

### Using Breakpoints

For debug sessions:

```json
{
  "breakpoints": [0, 5, 10],
  "timeline": [...]
}
```

### Descriptive Descriptions

```json
{
  "name": "Repeater 4-tick delay",
  "description": "Verifies that a repeater on level 4 delays exactly 8 game ticks. Setup: Redstone block -> Wire -> Repeater(4) -> Wire. Expected: After 8 ticks the output wire is powered."
}
```

## Contributing Your Tests

Tests that validate vanilla Minecraft behavior should be contributed to [FlintBench](../../tools/flintbench/), the official test collection. This ensures tests are:

- Available to the entire community
- Properly organized and formatted
- Used to validate server implementations

See the [FlintBench documentation](../../tools/flintbench/) for contribution guidelines.
