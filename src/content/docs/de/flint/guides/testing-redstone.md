---
title: Redstone testen
description: Spezielle Tipps und Patterns für Redstone-Tests
sidebar:
  order: 2
---

Redstone ist komplex und erfordert präzises Timing. Dieser Guide zeigt, wie du Redstone-Mechaniken effektiv testest.

## Redstone-Grundlagen

### Signal-Timing

| Komponente | Verzögerung (Game-Ticks) |
|------------|--------------------------|
| Redstone-Wire | 0 (instant) |
| Repeater (1-4 Ticks) | 2-8 |
| Comparator | 2 |
| Observer | 2 |
| Torch | 2 |

## Signal-Tests

### Signalstärke-Abfall

```json
{
  "name": "Redstone-Signal verliert 1 pro Block",
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
        { "pos": [1, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 15 } },
        { "pos": [2, 0, 0], "is": { "id": "minecraft:redstone_wire", "power": 14 } }
      ]
    }
  ]
}
```

## Repeater-Tests

### Verzögerungs-Test

```json
{
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } },
        { "pos": [2, 0, 0], "block": { "id": "minecraft:repeater", "facing": "west", "delay": 4 }},
        { "pos": [3, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    },
    { "at": 1, "do": "place", "pos": [0, 0, 0], "block": { "id": "minecraft:redstone_block" } },
    { "at": 7, "do": "assert", "checks": [{ "pos": [3, 0, 0], "is": { "power": 0 } }] },
    { "at": 9, "do": "assert", "checks": [{ "pos": [3, 0, 0], "is": { "power": 15 } }] }
  ]
}
```

## Kolben-Tests

### Kolben schiebt Block

```json
{
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:piston", "facing": "east" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:stone" } }
      ]
    },
    { "at": 1, "do": "place", "pos": [-1, 0, 0], "block": { "id": "minecraft:redstone_block" } },
    {
      "at": 4,
      "do": "assert",
      "checks": [
        { "pos": [0, 0, 0], "is": { "extended": true } },
        { "pos": [2, 0, 0], "is": { "id": "minecraft:stone" } }
      ]
    }
  ]
}
```

## Tipps

1. **Timing großzügig wählen** - Lieber einen Tick mehr warten
2. **placeEach für Setup** - Vermeidet ungewollte Zwischen-Updates
3. **Power-Level genau prüfen** - 0-15, nicht nur an/aus
