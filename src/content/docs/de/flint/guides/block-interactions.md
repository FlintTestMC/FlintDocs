---
title: Block-Interaktionen testen
description: Tests für Spieler-Block-Interaktionen mit useItemOn
sidebar:
  order: 3
---

Dieser Guide zeigt, wie du Spieler-Interaktionen mit Blöcken testest.

## Simple Mode vs. Advanced Mode

### Simple Mode

Das Item wird direkt in der Aktion angegeben:

```json
{
  "at": 1,
  "do": "useItemOn",
  "pos": [0, 0, 0],
  "face": "top",
  "item": "minecraft:honeycomb"
}
```

### Advanced Mode

Das Spieler-Inventar wird im Setup konfiguriert:

```json
{
  "setup": {
    "cleanup": { "region": [[0, 0, 0], [2, 2, 2]] },
    "player": {
      "inventory": {
        "hotbar1": { "item": "minecraft:honeycomb", "count": 64 }
      },
      "selectedHotbar": 1
    }
  }
}
```

## Block-Seiten (Faces)

| Seite | Richtung |
|-------|----------|
| `top` | +Y (oben) |
| `bottom` | -Y (unten) |
| `north` | -Z |
| `south` | +Z |
| `east` | +X |
| `west` | -X |

## Typische Interaktionen

### Kupfer wachsen

```json
{
  "timeline": [
    { "at": 0, "do": "place", "pos": [0,0,0], "block": { "id": "minecraft:copper_block" } },
    { "at": 1, "do": "useItemOn", "pos": [0,0,0], "face": "top", "item": "minecraft:honeycomb" },
    { "at": 2, "do": "assert", "checks": [{ "pos": [0,0,0], "is": { "id": "minecraft:waxed_copper_block" } }] }
  ]
}
```

### Holz entrinden

```json
{
  "timeline": [
    { "at": 0, "do": "place", "pos": [0,0,0], "block": { "id": "minecraft:oak_log" } },
    { "at": 1, "do": "useItemOn", "pos": [0,0,0], "face": "top", "item": "minecraft:diamond_axe" },
    { "at": 2, "do": "assert", "checks": [{ "pos": [0,0,0], "is": { "id": "minecraft:stripped_oak_log" } }] }
  ]
}
```

## Inventar-Management

### Hotbar wechseln

```json
{ "at": 2, "do": "selectHotbar", "slot": 2 }
```

### Slot setzen

```json
{ "at": 5, "do": "setSlot", "slot": "hotbar1", "item": "minecraft:water_bucket", "count": 1 }
```

### Slot leeren

```json
{ "at": 10, "do": "setSlot", "slot": "hotbar1" }
```

## Tipps

1. **Simple Mode für einfache Tests** - Weniger Setup-Code
2. **Advanced Mode für komplexe Abläufe** - Wenn mehrere Items gebraucht werden
3. **Face richtig wählen** - Beeinflusst Platzierung und Ausrichtung
4. **Nach Interaktion warten** - Mindestens 1 Tick für Block-Updates
