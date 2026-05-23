---
title: Testformat Übersicht
description: Struktur und Aufbau von Flint-Testdateien
sidebar:
  order: 1
---

Flint-Tests sind JSON-Dateien mit einer definierten Struktur. Diese Seite erklärt den grundlegenden Aufbau.

## Grundstruktur

```json
{
  "flintVersion": "1.0.0",
  "name": "Testname",
  "description": "Optionale Beschreibung",
  "tags": ["unit", "redstone"],
  "minecraftIds": ["minecraft:lever"],
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

## Felder

### Pflichtfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `name` | string | Name des Tests (wird in Ausgabe angezeigt) |
| `setup` | object | Test-Konfiguration mit Cleanup-Region |
| `timeline` | array | Liste der Aktionen |

### Optionale Felder

| Feld | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `flintVersion` | string | - | Flint-Version für Kompatibilität |
| `description` | string | - | Ausführliche Beschreibung |
| `tags` | string[] | `["default"]` | Tags für Filterung |
| `minecraftIds` | string[] | `[]` | Minecraft-Block- oder Item-IDs, die der Test abdeckt |
| `dependencies` | string[] | `[]` | Tests, die vorher laufen müssen |
| `breakpoints` | number[] | `[]` | Ticks für Debug-Pause |

`flintVersion` wird vor dem vollständigen Parsen geprüft. Aktuelle Flint-Implementierungen akzeptieren Specs bis `1.0.0`; inkompatible Dateien werden als übersprungen gemeldet.

## Setup-Sektion

Die Setup-Sektion konfiguriert die Testumgebung.

### Cleanup-Region (Pflicht)

```json
{
  "setup": {
    "cleanup": {
      "region": [[minX, minY, minZ], [maxX, maxY, maxZ]]
    }
  }
}
```

**Einschränkungen:**
- Maximale Breite (X): 15 Blöcke
- Maximale Höhe (Y): 384 Blöcke
- Maximale Tiefe (Z): 15 Blöcke
- Alle Positionen in der Timeline müssen innerhalb dieser Region liegen

### Spieler-Konfiguration (Optional)

```json
{
  "setup": {
    "cleanup": { "region": [[0,0,0], [5,5,5]] },
    "player": {
      "inventory": {
        "hotbar1": { "id": "minecraft:diamond_axe", "count": 1 },
        "hotbar2": { "id": "minecraft:honeycomb", "count": 64 },
        "off_hand": { "id": "minecraft:shield", "count": 1 }
      },
      "selected_hotbar": 1,
      "game_mode": "Creative"
    }
  }
}
```

**Verfügbare Slots:**

| Slot | Beschreibung |
|------|--------------|
| `hotbar1` - `hotbar9` | Hotbar-Plätze |
| `off_hand` | Nebenhand |
| `helmet` | Helm |
| `chestplate` | Brustpanzer |
| `leggings` | Beinschutz |
| `boots` | Stiefel |

Items verwenden in Setup und Inventory-Assertions dieselbe Form:

```json
{ "id": "minecraft:honeycomb", "count": 64 }
```

Zusätzliche Item-Daten können direkt in das Objekt geschrieben werden, wenn der Adapter sie unterstützt.

## Timeline-Sektion

Die Timeline ist ein Array von Aktionen, die zu bestimmten Ticks ausgeführt werden.

```json
{
  "timeline": [
    { "at": 0, "do": "place", ... },
    { "at": 5, "do": "assert", ... }
  ]
}
```

### Tick-Spezifikation

Aktionen können zu einem oder mehreren Ticks ausgeführt werden:

```json
// Einzelner Tick
{ "at": 5, "do": "place", ... }

// Mehrere Ticks (Aktion wird wiederholt)
{ "at": [0, 5, 10], "do": "assert", ... }
```

## Block-Spezifikation

Blöcke können mit Properties auf zwei Arten definiert werden:

### Flache Properties

```json
{
  "id": "minecraft:lever",
  "powered": false,
  "face": "floor",
  "facing": "north"
}
```

### Verschachtelte Properties

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

Beide Formate erzeugen denselben Block-State:
```
minecraft:lever[powered=false,face=floor,facing=north]
```

### Property-Werttypen

- **Strings:** `"north"`, `"side"`, `"floor"`
- **Booleans:** `true`, `false`
- **Zahlen:** `15`, `0`

Flint speichert Block-Properties intern als Strings. Die Beispiele werden also nach dem Parsen zu `"north"`, `"true"` und `"15"`.

## Tags

Tags ermöglichen das Filtern und Gruppieren von Tests.

```json
{
  "tags": ["redstone", "unit", "fast"]
}
```

Tests ohne Tags werden automatisch dem Tag `default` zugewiesen.

## Validierung

Flint prüft beim Laden:

1. `setup.cleanup.region` muss vorhanden sein.
2. Die Cleanup-Region darf höchstens `15 x 384 x 15` Blöcke groß sein.
3. Timeline-Positionen müssen innerhalb der Cleanup-Region liegen.
4. JSON-Fehler werden mit Datei, Zeile und Spalte gemeldet.
