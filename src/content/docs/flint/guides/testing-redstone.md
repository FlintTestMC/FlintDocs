---
title: Testing Redstone
description: Special tips and patterns for redstone tests
sidebar:
  order: 2
---

Redstone is complex and requires precise timing. This guide shows how to effectively test redstone mechanics.

## Redstone Basics in Flint

### Signal Timing

| Component | Delay (game ticks) |
|-----------|-------------------|
| Redstone wire | 0 (instant) |
| Repeater (1 tick) | 2 |
| Repeater (2 ticks) | 4 |
| Repeater (3 ticks) | 6 |
| Repeater (4 ticks) | 8 |
| Comparator | 2 |
| Observer | 2 |
| Torch (off→on) | 2 |
| Torch (on→off) | 2 |

### Block Updates

When a block is placed, neighbor updates are triggered. The order is:
1. Block itself
2. All 6 neighbors

## Signal Tests

### Signal Strength Decay

```json
{
  "name": "Redstone signal loses 1 per block",
  "tags": ["redstone", "signal"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [5, 1, 0]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:redstone_block" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [3, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [4, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    {
      "at": 1,
      "do": "assert",
      "checks": [
        { "pos": [1, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 15 } },
        { "pos": [2, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 14 } },
        { "pos": [3, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 13 } },
        { "pos": [4, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 12 } }
      ]
    }
  ]
}
```

### Signal Boosting with Repeater

```json
{
  "name": "Repeater boosts signal to 15",
  "tags": ["redstone", "repeater"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [4, 1, 0]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:redstone_wire", "power": 1 } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:repeater", "facing": "west", "delay": 1 } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    {
      "at": 0,
      "do": "place",
      "pos": [-1, 0, 0],
      "block": { "id": "minecraft:redstone_block" }
    },
    {
      "at": 3,
      "do": "assert",
      "checks": [
        { "pos": [2, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 15 } }
      ]
    }
  ]
}
```

## Repeater Tests

### Delay Test

```json
{
  "name": "Repeater 4-tick delay",
  "tags": ["redstone", "repeater", "timing"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [4, 1, 0]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": {
            "id": "minecraft:repeater",
            "facing": "west",
            "delay": 4
        }},
        { "pos": [3, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    {
      "at": 1,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:redstone_block" }
    },
    {
      "at": 7,
      "do": "assert",
      "checks": [
        { "pos": [3, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 0 } }
      ]
    },
    {
      "at": 9,
      "do": "assert",
      "checks": [
        { "pos": [3, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 15 } }
      ]
    }
  ]
}
```

### Repeater Lock

```json
{
  "name": "Repeater is locked by side repeater",
  "tags": ["redstone", "repeater", "lock"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [3, 1, 2]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [1, 0, 1], "block": { "id": "minecraft:repeater", "facing": "west" } },
        { "pos": [2, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:repeater", "facing": "north" } },
        { "pos": [1, 0, 2], "block": { "id": "minecraft:redstone_block" } }
      ]
    },
    {
      "at": 3,
      "do": "assert",
      "checks": [
        { "pos": [1, 0, 1], "is": { "id": "minecraft:repeater", "locked": true } }
      ]
    }
  ]
}
```

## Comparator Tests

### Comparator in Compare Mode

```json
{
  "name": "Comparator compares signal strengths",
  "tags": ["redstone", "comparator"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [4, 1, 2]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 1], "block": { "id": "minecraft:redstone_block" } },
        { "pos": [1, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 1], "block": { "id": "minecraft:comparator", "facing": "west", "mode": "compare" } },
        { "pos": [3, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire", "power": 10 } }
      ]
    },
    {
      "at": 3,
      "do": "assert",
      "checks": [
        { "pos": [3, 0, 1], "is": { "id": "minecraft:redstone_wire", "power": 14 } }
      ]
    }
  ]
}
```

### Comparator in Subtract Mode

```json
{
  "name": "Comparator subtracts signal strengths",
  "tags": ["redstone", "comparator"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [4, 1, 2]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 1], "block": { "id": "minecraft:redstone_block" } },
        { "pos": [1, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 1], "block": { "id": "minecraft:comparator", "facing": "west", "mode": "subtract" } },
        { "pos": [3, 0, 1], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:redstone_wire", "power": 10 } }
      ]
    },
    {
      "at": 3,
      "do": "assert",
      "checks": [
        { "pos": [3, 0, 1], "is": { "id": "minecraft:redstone_wire", "power": 4 } }
      ]
    }
  ]
}
```

## Piston Tests

### Piston Pushes Block

```json
{
  "name": "Piston pushes block on activation",
  "tags": ["redstone", "piston"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [3, 1, 0]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:piston", "facing": "east" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:stone" } }
      ]
    },
    {
      "at": 1,
      "do": "place",
      "pos": [-1, 0, 0],
      "block": { "id": "minecraft:redstone_block" }
    },
    {
      "at": 4,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:piston", "extended": true } },
        { "pos": [2, 0, 0], "is": { "id": "minecraft:stone" } }
      ]
    }
  ]
}
```

### 12-Block Push Limit

```json
{
  "name": "Piston pushes maximum 12 blocks",
  "tags": ["redstone", "piston", "limit"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [14, 1, 0]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:piston", "facing": "east" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [3, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [4, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [5, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [6, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [7, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [8, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [9, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [10, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [11, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [12, 0, 0], "block": { "id": "minecraft:stone" } }
      ]
    },
    {
      "at": 1,
      "do": "place",
      "pos": [-1, 0, 0],
      "block": { "id": "minecraft:redstone_block" }
    },
    {
      "at": 5,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:piston", "extended": false } }
      ]
    }
  ]
}
```

## Tips for Redstone Tests

1. **Be generous with timing** - Better to wait one extra tick
2. **Use placeEach for setup** - Avoids unwanted intermediate updates
3. **Check wire connections** - `north`, `south`, `east`, `west` properties
4. **Assert before and after** - Verify state before and after changes
5. **Check exact power levels** - 0-15, not just on/off
