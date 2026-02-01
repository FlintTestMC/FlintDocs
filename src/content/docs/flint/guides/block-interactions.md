---
title: Testing Block Interactions
description: Tests for player-block interactions with useItemOn
sidebar:
  order: 3
---

This guide shows how to test player interactions with blocks.

## Basics

The `useItemOn` action simulates a player using an item on a block. This tests the actual server interaction logic.

## Simple Mode vs. Advanced Mode

### Simple Mode

The item is specified directly in the action:

```json
{
  "at": 1,
  "do": "useItemOn",
  "pos": [0, 0, 0],
  "face": "top",
  "item": "minecraft:honeycomb"
}
```

**Advantages:**
- Easier to write
- No player setup needed
- Ideal for single interactions

### Advanced Mode

Player inventory is configured in setup:

```json
{
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [2, 2, 2]] },
    "player": {
      "inventory": {
        "hotbar1": { "item": "minecraft:honeycomb", "count": 64 },
        "hotbar2": { "item": "minecraft:diamond_axe", "count": 1 }
      },
      "selectedHotbar": 1
    }
  },
  "timeline": [
    { "at": 1, "do": "useItemOn", "pos": [0, 0, 0], "face": "top" }
  ]
}
```

**Advantages:**
- Inventory persists between actions
- Hotbar switching possible
- Realistic player simulation

## Block Faces

```
       top (+Y)
          │
          ▼
    ┌───────────┐
    │           │
west│           │east
(-X)│   Block   │(+X)
    │           │
    └───────────┘
          │
          ▼
      bottom (-Y)

      north (-Z) ←→ south (+Z)
```

| Face | Direction | Description |
|------|-----------|-------------|
| `top` | +Y | Top side |
| `bottom` | -Y | Bottom side |
| `north` | -Z | North side |
| `south` | +Z | South side |
| `east` | +X | East side |
| `west` | -X | West side |

## Typical Interactions

### Waxing Copper

```json
{
  "name": "Honeycomb waxes copper block",
  "tags": ["copper", "waxing"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [1, 1, 1]] }
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
        { "pos": [0, 0, 0], "is": { "id": "minecraft:waxed_copper_block" } }
      ]
    }
  ]
}
```

### Stripping Wood

```json
{
  "name": "Axe strips oak log",
  "tags": ["wood", "stripping"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [1, 1, 1]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:oak_log", "axis": "y" }
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:diamond_axe"
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:stripped_oak_log", "axis": "y" } }
      ]
    }
  ]
}
```

### Creating Dirt Path

```json
{
  "name": "Shovel creates path from grass block",
  "tags": ["dirt", "path"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [1, 2, 1]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:grass_block" }
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:diamond_shovel"
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:dirt_path" } }
      ]
    }
  ]
}
```

### Tilling Dirt

```json
{
  "name": "Hoe creates farmland",
  "tags": ["farming"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [1, 1, 1]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:dirt" }
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:diamond_hoe"
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:farmland" } }
      ]
    }
  ]
}
```

## Inventory Management

### Switching Hotbar

```json
{
  "name": "Use different items sequentially",
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [2, 1, 1]] },
    "player": {
      "inventory": {
        "hotbar1": { "item": "minecraft:honeycomb", "count": 1 },
        "hotbar2": { "item": "minecraft:diamond_axe", "count": 1 }
      },
      "selectedHotbar": 1
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:copper_block" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:oak_log" } }
      ]
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top"
    },
    {
      "at": 2,
      "do": "selectHotbar",
      "slot": 2
    },
    {
      "at": 3,
      "do": "useItemOn",
      "pos": [1, 0, 0],
      "face": "top"
    },
    {
      "at": 4,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:waxed_copper_block" } },
        { "pos": [1, 0, 0], "is": { "id": "minecraft:stripped_oak_log" } }
      ]
    }
  ]
}
```

### Changing Slot During Test

```json
{
  "at": 5,
  "do": "setSlot",
  "slot": "hotbar1",
  "item": "minecraft:water_bucket",
  "count": 1
}
```

### Clearing Slot

```json
{
  "at": 10,
  "do": "setSlot",
  "slot": "hotbar1"
}
```

## Multiple Interactions

### Removing Oxidation

Wax must be removed before oxidation can be scraped:

```json
{
  "name": "Axe removes wax from oxidized copper",
  "tags": ["copper"],
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [1, 1, 1]] }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 0, 0],
      "block": { "id": "minecraft:waxed_oxidized_copper" }
    },
    {
      "at": 1,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:diamond_axe"
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:oxidized_copper" } }
      ]
    },
    {
      "at": 3,
      "do": "useItemOn",
      "pos": [0, 0, 0],
      "face": "top",
      "item": "minecraft:diamond_axe"
    },
    {
      "at": 4,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "id": "minecraft:weathered_copper" } }
      ]
    }
  ]
}
```

## Tips

1. **Use simple mode for simple tests** - Less setup code
2. **Use advanced mode for complex flows** - When multiple items are needed
3. **Choose face correctly** - Affects placement and orientation
4. **Wait after interaction** - At least 1 tick for block updates
5. **Check properties** - Not just block ID, also orientation etc.
