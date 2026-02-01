---
title: Quickstart
description: Write your first Flint test in 5 minutes
sidebar:
  order: 2
---

This guide shows you how to write your first Flint test in just a few minutes.

## Minimal Test

Create a file `my-first-test.json`:

```json
{
  "name": "Stone is placed",
  "description": "Checks if a stone block is placed correctly",
  "tags": ["basic"],
  "setup": {
    "cleanup": {
      "region": [[0, 0, 0], [1, 1, 1]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:stone" }
    },
    {
      "at": 1,
      "do": "assert",
      "checks": [
        {
          "pos": [0, 0, 0],
          "is": { "id": "minecraft:stone" }
        }
      ]
    }
  ]
}
```

### What's happening here?

1. **setup.cleanup.region** - Defines the area `[0,0,0]` to `[1,1,1]` where the test takes place
2. **timeline[0]** - At tick 0, a stone block is placed at `[0,0,0]`
3. **timeline[1]** - At tick 1, we verify that stone actually exists there

## Redstone Test

A slightly more complex test that checks redstone signal transmission:

```json
{
  "name": "Redstone signal propagates",
  "tags": ["redstone", "unit"],
  "setup": {
    "cleanup": {
      "region": [[0, 0, 0], [3, 1, 0]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:redstone_block" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    {
      "at": 1,
      "do": "assert",
      "checks": [
        {
          "pos": [1, 0, 0],
          "is": { "id": "minecraft:redstone_wire", "power": 15 }
        },
        {
          "pos": [2, 0, 0],
          "is": { "id": "minecraft:redstone_wire", "power": 14 }
        }
      ]
    }
  ]
}
```

### Key Concepts

- **placeEach** - Places multiple blocks atomically in the same tick
- **Block properties** - With `"power": 15` we check the redstone signal level
- **Multiple checks** - One assertion can verify multiple positions

## Player Interaction Test

Test with player actions (e.g., waxing copper):

```json
{
  "name": "Honeycomb waxes copper",
  "tags": ["copper", "interaction"],
  "setup": {
    "cleanup": {
      "region": [[0, 0, 0], [1, 1, 1]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:copper_block" }
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:honeycomb"
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        {
          "pos": [0, 0, 0],
          "is": { "id": "minecraft:waxed_copper_block" }
        }
      ]
    }
  ]
}
```

### Simple Mode vs. Advanced Mode

**Simple Mode** (as shown above):
```json
{ "do": "useItemOn", "pos": [0,0,0], "face": "top", "item": "minecraft:honeycomb" }
```
The item is specified directly - Flint automatically sets it in the inventory.

**Advanced Mode** (with player setup):
```json
{
  "setup": {
    "cleanup": { "region": [[0,0,0], [1,1,1]] },
    "player": {
      "inventory": {
        "hotbar1": { "item": "minecraft:honeycomb", "count": 64 }
      },
      "selectedHotbar": 1
    }
  },
  "timeline": [
    { "at": 1, "do": "useItemOn", "pos": [0,0,0], "face": "top" }
  ]
}
```
Here the player inventory is explicitly configured.

## Directory Structure

Organize your tests in folders:

```
tests/
├── redstone/
│   ├── signal-strength.json
│   ├── repeater-delay.json
│   └── comparator.json
├── blocks/
│   ├── copper-oxidation.json
│   └── waxing.json
└── pistons/
    ├── push-limit.json
    └── quasi-connectivity.json
```

## Running Tests

With a Flint-compatible server:

```rust
use flint_core::{TestRunner, TestSpec};

let adapter = MyServerAdapter::new();
let runner = TestRunner::new(&adapter);

let spec = TestSpec::from_file(&Path::new("tests/my-test.json"))?;
let result = runner.run_test(&spec);

if result.success {
    println!("Test passed!");
} else {
    println!("Test failed: {:?}", result.failure_reason);
}
```

## Common Errors

### Position outside cleanup region
```
Error: Position [5,0,0] is outside cleanup region [0,0,0] to [1,1,1]
```
**Solution:** Expand the cleanup region or correct the position.

### Missing setup section
```
Error: Test 'My Test' missing required 'setup' section
```
**Solution:** Every test needs `setup.cleanup.region`.

### Block mismatch
```
Error: Block mismatch at [0,0,0]: expected 'minecraft:stone', got 'minecraft:air'
```
**Solution:** Check timing - perhaps the block hasn't been placed yet or was already removed.

## Next Steps

- [Test Format Reference](./testformat/overview/) - All available actions
- [Writing Tests](./guides/writing-tests/) - Best practices
- [Testing Redstone](./guides/testing-redstone/) - Special tips for redstone
