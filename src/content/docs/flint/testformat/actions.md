---
title: Actions
description: All available actions in the Flint test format
sidebar:
  order: 2
---

This page documents all available actions for the timeline.

## Block Actions

### place

Places a single block.

```json
{
  "at": 0,
  "do": "place",
  "pos": [5, 1, 5],
  "block": {
    "id": "minecraft:lever",
    "powered": false,
    "face": "floor"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pos` | [x, y, z] | Block position |
| `block` | object | Block with ID and properties |

### place_each

Places multiple blocks atomically in the same tick. Ideal for setup phases.

```json
{
  "at": 0,
  "do": "place_each",
  "blocks": [
    { "pos": [0, 0, 0], "block": { "id": "minecraft:stone" } },
    { "pos": [1, 0, 0], "block": { "id": "minecraft:dirt" } },
    { "pos": [2, 0, 0], "block": { "id": "minecraft:grass_block" } }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `blocks` | array | List of block placements |
| `blocks[].pos` | [x, y, z] | Position |
| `blocks[].block` | object | Block definition |

**When to use place_each:**
- Initial block placement at tick 0
- When multiple blocks must exist simultaneously
- For atomic operations (all or nothing)

### fill

Fills a region with a block type.

```json
{
  "at": 0,
  "do": "fill",
  "region": [[0, 0, 0], [10, 0, 10]],
  "with": { "id": "minecraft:stone" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `region` | [[x1,y1,z1], [x2,y2,z2]] | Area to fill |
| `with` | object | Block definition |

**Note:** Coordinates can be swapped - Flint automatically determines min/max.

### remove

Removes a block (replaces with air).

```json
{
  "at": 5,
  "do": "remove",
  "pos": [5, 1, 5]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pos` | [x, y, z] | Position of block to remove |

## Player Actions

### use_item_on

Uses an item on a block face. This triggers the server's interaction logic.

**Simple Mode** - Item is specified directly:

```json
{
  "at": 5,
  "do": "use_item_on",
  "pos": [3, 1, 3],
  "face": "top",
  "item": "minecraft:honeycomb"
}
```

**Advanced Mode** - Uses the player's current held item:

```json
{
  "at": 5,
  "do": "use_item_on",
  "pos": [3, 1, 3],
  "face": "north"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos` | [x, y, z] | Yes | Block position |
| `face` | string | Yes | Block face |
| `item` | string | No | Item for simple mode |

**Block Faces:**

| Face | Direction |
|------|-----------|
| `top` | +Y (above) |
| `bottom` | -Y (below) |
| `north` | -Z |
| `south` | +Z |
| `east` | +X |
| `west` | -X |

### set_slot

Sets an item in a player slot.

```json
{
  "at": 3,
  "do": "set_slot",
  "slot": "hotbar1",
  "item": "minecraft:diamond_pickaxe",
  "count": 1
}
```

To clear a slot:

```json
{
  "at": 3,
  "do": "set_slot",
  "slot": "hotbar1"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slot` | string | Yes | Slot name |
| `item` | string | No | Item ID (empty = clear slot) |
| `count` | number | No | Amount (default: 1) |

### select_hotbar

Selects a hotbar slot (1-9).

```json
{
  "at": 4,
  "do": "select_hotbar",
  "slot": 2
}
```

| Field | Type | Description |
|-------|------|-------------|
| `slot` | number | Hotbar slot (1-9) |

## Assertion Actions

### assert

Verifies block states and inventory slots.

```json
{
  "at": 10,
  "do": "assert",
  "checks": [
    {
      "pos": [5, 1, 5],
      "is": {
        "id": "minecraft:redstone_wire",
        "power": 15,
        "north": "side"
      }
    },
    {
      "pos": [6, 1, 5],
      "is": { "id": "minecraft:air" }
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `checks` | array | List of checks |
| `checks[].pos` | [x, y, z] | Position for block checks |
| `checks[].slot` | string | Slot for inventory checks |
| `checks[].is` | object, array, or `"empty"` | Expected block or item |

**Behavior:**
- Block ID is checked (with or without `minecraft:` prefix)
- Only specified properties are checked
- Unspecified properties are ignored
- On failure, the test stops immediately

`is` may also be an array of accepted blocks:

```json
{
  "pos": [0, 0, 0],
  "is": [
    { "id": "minecraft:air" },
    { "id": "minecraft:water" }
  ]
}
```

Inventory checks use `slot` instead of `pos`. Use `"empty"` or omit `is` to assert an empty slot.

```json
{
  "at": 3,
  "do": "assert",
  "checks": [
    {
      "slot": "hotbar1",
      "is": { "id": "minecraft:honeycomb", "count": 63 }
    },
    {
      "slot": "off_hand",
      "is": "empty"
    }
  ]
}
```

There is no separate `assert_state` action in the current schema. To check changing state over time, schedule normal `assert` actions at multiple ticks.

## Timing Examples

### Sequential Actions

```json
{
  "timeline": [
    { "at": 0, "do": "place", "pos": [0,0,0], "block": {"id": "minecraft:sand"} },
    { "at": 1, "do": "remove", "pos": [0,-1,0] },
    { "at": 5, "do": "assert", "checks": [
      { "pos": [0,0,0], "is": {"id": "minecraft:air"} },
      { "pos": [0,-1,0], "is": {"id": "minecraft:sand"} }
    ]}
  ]
}
```

### Repeated Assertions

```json
{
  "at": [10, 20, 30, 40, 50],
  "do": "assert",
  "checks": [
    { "pos": [5, 1, 5], "is": { "id": "minecraft:redstone_lamp", "lit": true } }
  ]
}
```

### Timing for Redstone Components

| Component | Delay (game ticks) |
|-----------|-------------------|
| Redstone wire | 0 (instant) |
| Repeater (1 tick) | 2 |
| Repeater (4 ticks) | 8 |
| Comparator | 2 |
| Observer | 2 |
