---
title: Aktionen
description: Alle verfügbaren Aktionen im Flint-Testformat
sidebar:
  order: 2
---

Diese Seite dokumentiert alle verfügbaren Aktionen für die Timeline.

## Block-Aktionen

### place

Platziert einen einzelnen Block.

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

### placeEach

Platziert mehrere Blöcke atomar im selben Tick.

```json
{
  "at": 0,
  "do": "placeEach",
  "blocks": [
    { "pos": [0, 0, 0], "block": { "id": "minecraft:stone" } },
    { "pos": [1, 0, 0], "block": { "id": "minecraft:dirt" } }
  ]
}
```

### fill

Füllt eine Region mit einem Block-Typ.

```json
{
  "at": 0,
  "do": "fill",
  "region": [[0, 0, 0], [10, 0, 10]],
  "with": { "id": "minecraft:stone" }
}
```

### remove

Entfernt einen Block (ersetzt mit Luft).

```json
{
  "at": 5,
  "do": "remove",
  "pos": [5, 1, 5]
}
```

## Spieler-Aktionen

### useItemOn

Benutzt ein Item auf einer Block-Seite.

```json
{
  "at": 5,
  "do": "useItemOn",
  "pos": [3, 1, 3],
  "face": "top",
  "item": "minecraft:honeycomb"
}
```

**Block-Seiten:** `top`, `bottom`, `north`, `south`, `east`, `west`

### setSlot

Setzt ein Item in einen Spieler-Slot.

```json
{
  "at": 3,
  "do": "setSlot",
  "slot": "hotbar1",
  "item": "minecraft:diamond_pickaxe",
  "count": 1
}
```

### selectHotbar

Wählt einen Hotbar-Slot aus (1-9).

```json
{
  "at": 4,
  "do": "selectHotbar",
  "slot": 2
}
```

## Assertion-Aktionen

### assert

Prüft Block-Zustände an angegebenen Positionen.

```json
{
  "at": 10,
  "do": "assert",
  "checks": [
    {
      "pos": [5, 1, 5],
      "is": {
        "id": "minecraft:redstone_wire",
        "power": 15
      }
    }
  ]
}
```

## Timing für Redstone

| Komponente | Verzögerung (Game-Ticks) |
|------------|--------------------------|
| Redstone-Wire | 0 (instant) |
| Repeater (1 Tick) | 2 |
| Repeater (4 Ticks) | 8 |
| Comparator | 2 |
| Observer | 2 |
