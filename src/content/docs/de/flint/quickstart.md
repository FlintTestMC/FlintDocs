---
title: Schnellstart
description: Schreibe deinen ersten Flint-Test in 5 Minuten
sidebar:
  order: 2
---

Dieser Guide zeigt, wie du in wenigen Minuten deinen ersten Flint-Test schreibst.

## Minimaler Test

Erstelle eine Datei `mein-erster-test.json`:

```json
{
  "name": "Stein wird platziert",
  "description": "Prüft, ob ein Steinblock korrekt platziert wird",
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

### Was passiert hier?

1. **setup.cleanup.region** - Definiert den Bereich `[0,0,0]` bis `[1,1,1]`, in dem der Test stattfindet
2. **timeline[0]** - Bei Tick 0 wird ein Steinblock bei `[0,0,0]` platziert
3. **timeline[1]** - Bei Tick 1 wird geprüft, ob dort tatsächlich Stein ist

## Redstone-Test

Ein etwas komplexerer Test, der Redstone-Signalübertragung prüft:

```json
{
  "name": "Redstone-Signal überträgt sich",
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

### Wichtige Konzepte

- **placeEach** - Platziert mehrere Blöcke atomar im selben Tick
- **Block-Properties** - Mit `"power": 15` prüfen wir den Redstone-Signalpegel
- **Mehrere Checks** - Eine Assertion kann mehrere Positionen prüfen

## Spieler-Interaktions-Test

Test mit Spieler-Aktionen (z.B. Wachsen von Kupfer):

```json
{
  "name": "Honigwabe wachst Kupfer",
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

**Simple Mode** (wie oben):
```json
{ "do": "useItemOn", "pos": [0,0,0], "face": "top", "item": "minecraft:honeycomb" }
```
Das Item wird direkt angegeben - Flint setzt es automatisch ins Inventar.

**Advanced Mode** (mit Spieler-Setup):
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
Hier wird das Spieler-Inventar explizit konfiguriert.

## Verzeichnisstruktur

Organisiere deine Tests in Ordnern:

```
tests/
├── redstone/
│   ├── signalstaerke.json
│   ├── repeater-delay.json
│   └── comparator.json
├── bloecke/
│   ├── kupfer-oxidation.json
│   └── wachsen.json
└── pistons/
    ├── push-limit.json
    └── quasi-connectivity.json
```

## Tests ausführen

Mit einem Flint-kompatiblen Server:

```rust
use flint_core::{TestRunner, TestSpec};

let adapter = MeinServerAdapter::new();
let runner = TestRunner::new(&adapter);

let spec = TestSpec::from_file(&Path::new("tests/mein-test.json"))?;
let result = runner.run_test(&spec);

if result.success {
    println!("Test bestanden!");
} else {
    println!("Test fehlgeschlagen: {:?}", result.failure_reason);
}
```

## Häufige Fehler

### Position außerhalb der Cleanup-Region
```
Error: Position [5,0,0] is outside cleanup region [0,0,0] to [1,1,1]
```
**Lösung:** Erweitere die Cleanup-Region oder korrigiere die Position.

### Fehlende Setup-Sektion
```
Error: Test 'Mein Test' missing required 'setup' section
```
**Lösung:** Jeder Test braucht `setup.cleanup.region`.

### Block-Mismatch
```
Error: Block mismatch at [0,0,0]: expected 'minecraft:stone', got 'minecraft:air'
```
**Lösung:** Prüfe das Timing - möglicherweise wurde der Block noch nicht platziert oder bereits entfernt.

## Nächste Schritte

- [Testformat-Referenz](./testformat/overview/) - Alle verfügbaren Aktionen
- [Tests schreiben](./guides/writing-tests/) - Best Practices
- [Redstone testen](./guides/testing-redstone/) - Spezielle Tipps für Redstone
