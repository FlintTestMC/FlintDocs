---
title: Tests richtig schreiben
description: Best Practices und Muster für effektive Flint-Tests
sidebar:
  order: 1
---

Dieser Guide zeigt, wie du effektive und wartbare Tests schreibst.

## Grundprinzipien

### 1. Ein Test, ein Verhalten

Jeder Test sollte genau ein Verhalten prüfen.

**Schlecht:**
```json
{
  "name": "Redstone funktioniert",
  "timeline": [
    // Testet alles auf einmal
  ]
}
```

**Gut:**
```json
{
  "name": "Redstone-Signal verliert 1 Stärke pro Block",
  "timeline": [
    // Nur Signalstärke-Abfall
  ]
}
```

### 2. Aussagekräftige Namen

Der Testname sollte das erwartete Verhalten beschreiben.

**Schlecht:** `test1.json`, `redstone.json`

**Gut:** `redstone-signal-verliert-staerke-pro-block.json`

### 3. Minimale Cleanup-Region

Verwende nur so viel Platz wie nötig.

### 4. Atomares Setup mit placeEach

Platziere alle initialen Blöcke in einem Tick.

```json
{
  "timeline": [
    {
      "at": 0,
      "do": "placeEach",
      "blocks": [
        { "pos": [0, 0, 0], "block": { "id": "minecraft:stone" } },
        { "pos": [1, 0, 0], "block": { "id": "minecraft:redstone_wire" } }
      ]
    }
  ]
}
```

## Test-Struktur

```
1. Setup (Tick 0)      - Initiale Blöcke platzieren
2. Aktion (Tick 1+)    - Die zu testende Aktion ausführen
3. Warten (optional)   - Zeit für Verarbeitung
4. Assertion           - Ergebnis prüfen
```

## Assertions effektiv nutzen

### Nur relevante Properties prüfen

```json
{
  "is": {
    "id": "minecraft:redstone_wire",
    "power": 15
  }
}
```

### Vorher-Nachher-Assertions

Prüfe den Zustand vor und nach einer Aktion.

### Mehrfache Assertions über Zeit

```json
{
  "at": [10, 20, 30],
  "do": "assert",
  "checks": [...]
}
```

## Timing richtig wählen

**Faustregel:** 1-2 Ticks nach einer Redstone-Änderung assertieren.

### Fallende Blöcke

Sand/Kies brauchen Zeit zum Fallen - etwa 10 Ticks einplanen.

### Observer-Ketten

Observer haben 2 Game-Ticks Verzögerung.

## Debugging

### Schritt-für-Schritt prüfen

Füge Zwischen-Assertions ein.

### Breakpoints nutzen

```json
{
  "breakpoints": [0, 5, 10],
  "timeline": [...]
}
```

### Aussagekräftige Beschreibungen

```json
{
  "name": "Repeater 4-Tick Verzögerung",
  "description": "Setup: Redstone-Block -> Wire -> Repeater(4) -> Wire. Erwartet: Nach 8 Ticks Output powered."
}
```

## Deine Tests beitragen

Tests, die Vanilla-Minecraft-Verhalten validieren, sollten zu [FlintBench](../../tools/flintbench) beigetragen werden, der offiziellen Test-Sammlung. Das stellt sicher, dass Tests:

- Der gesamten Community zur Verfügung stehen
- Richtig organisiert und formatiert sind
- Zur Validierung von Server-Implementierungen verwendet werden

Siehe die [FlintBench-Dokumentation](../../tools/flintbench) für Beitragsrichtlinien.
