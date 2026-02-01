---
title: Flint-Steel
description: White-Box Flint-Adapter für SteelMC Server-Tests
sidebar:
  order: 4
---

Flint-Steel ist der offizielle Flint-Adapter für [SteelMC](https://github.com/Steel-Foundation/SteelMC), der White-Box-Tests der Minecraft-Server-Implementierung ermöglicht. Im Gegensatz zu FlintCLIs Black-Box-Ansatz führt Flint-Steel Tests direkt gegen Steels Code aus.

## Überblick

Flint-Steel bietet:

- **Direktes Code-Testing** - Tests laufen gegen echten Steel-Server-Code, nicht über Netzwerk
- **Kein Server erforderlich** - Tests werden in-process ausgeführt ohne laufenden Server
- **Volle Genauigkeit** - Verwendet echte Block-Verhaltensweisen, Fluid-Dynamik und Spielmechaniken
- **Schnelle Ausführung** - Kein Netzwerk-Overhead, RAM-only Welt-Speicher

## Architektur

```
┌─────────────────────────────────────────────────────────┐
│                      Flint Core                         │
│         (Test-Specs, Loader, JSON-Parsing)              │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Flint-Steel                         │
│  ┌──────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │ SteelAdapter │  │ SteelWorld │  │  SteelPlayer   │  │
│  └──────────────┘  └────────────┘  └────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Steel Core                         │
│            (Block-Verhalten, Welt, Ticks)               │
└─────────────────────────────────────────────────────────┘
```

## Verwendung

### In Rust-Tests

```rust
use steel_flint::{SteelAdapter, TestLoader, TestRunner};

#[test]
fn run_flint_tests() {
    // Steel-Systeme initialisieren
    steel_flint::init();

    // Tests aus FlintBench laden
    let loader = TestLoader::new("./FlintBenchmark/tests", true).unwrap();
    let specs = loader.collect_all().unwrap();

    // Tests ausführen
    let adapter = SteelAdapter::new();
    let runner = TestRunner::new(&adapter);
    let summary = runner.run_tests(&specs);

    assert_eq!(summary.failed_tests, 0);
}
```

### Umgebungsvariablen

Tests mit Umgebungsvariablen filtern, mehr informationen sind [here](../../ENV):

```bash
# Spezifischen Test nach Namen ausführen
FLINT_TEST=water_falling_state cargo test

# Nach Muster filtern
FLINT_PATTERN=water cargo test

# Nach Tags filtern
FLINT_TAGS=redstone,water cargo test
```

### Über Cargo ausführen

```bash
# Alle Flint-Tests ausführen
cargo test --package steel-flint

# Mit spezifischen Tags ausführen
FLINT_TAGS=connectible cargo test --package steel-flint
```

## Funktionsweise

### Welt-Erstellung

Flint-Steel erstellt Test-Welten mit:

- **Leerer Chunk-Generator** - Chunks werden on-demand erstellt, kein Disk-I/O
- **RAM-only Speicher** - Schnelle, isolierte Test-Umgebungen
- **Volle Verhaltens-Systeme** - Echte Redstone-, Fluid-, Block-Updates

### Spieler-Simulation

Für Tests mit Spieler-Interaktionen (`use_item_on`, Inventar):

- Synthetische Spieler-Identitäten
- Volles Inventar-Management
- Block-Interaktions-Simulation
- Keine Netzwerk-Verbindung nötig

### Test-Ausführung

1. Welt mit Cleanup-Region erstellt
2. Timeline-Aktionen Tick für Tick ausgeführt
3. `do_tick()` schreitet Spielzustand voran
4. Assertions prüfen Block-Zustände
5. Welt nach Test zerstört

## Vergleich mit FlintCLI

| Feature | Flint-Steel | FlintCLI |
|---------|-------------|----------|
| Test-Typ | White-Box | Black-Box |
| Server erforderlich | Nein | Ja |
| Netzwerk-Overhead | Keiner | Ja |
| Funktioniert mit jedem Server | Nein (nur Steel) | Ja |
| Debug-Zugriff | Voll | Eingeschränkt |
| Geschwindigkeit | Sehr schnell | Langsamer |

**Verwende Flint-Steel wenn:**
- Du SteelMC entwickelst
- Schnelle Test-Iteration brauchst
- Debugger-Zugriff willst
- Interne Verhaltensweisen testest

**Verwende FlintCLI wenn:**
- Jeden Minecraft-Server testest
- Gegen Vanilla validierst
- CI/CD mit echten Servern
- Implementierungen vergleichst

## Integration mit FlintBench

Flint-Steel kann Tests aus [FlintBench](../flintbench/) ausführen, dafür muss die ENV variable `TEST_PATH` gesetzt werden mehr [hier](../../ENV), es kann auch der Pfad hinzugefügt werden statt `get_test_path` (nicht empfohlen):

```rust
let loader = TestLoader::new(get_test_path(), true)?;
let specs = loader.collect_by_tags(&["water", "connectible"])?;

let adapter = SteelAdapter::new();
let runner = TestRunner::new(&adapter);
let summary = runner.run_tests(&specs);
```

## Für andere Server implementieren

Andere Minecraft-Server-Implementierungen können eigene Flint-Adapter erstellen, indem sie die Traits implementieren:

```rust
pub trait FlintAdapter {
    type World: FlintWorld;
    fn create_world(&self, cleanup_region: Region) -> Self::World;
}

pub trait FlintWorld {
    fn place_block(&mut self, pos: BlockPos, block: &BlockSpec);
    fn get_block(&self, pos: BlockPos) -> BlockSpec;
    fn do_tick(&mut self);
    // ...
}

pub trait FlintPlayer {
    fn set_slot(&mut self, slot: Slot, item: ItemStack);
    fn use_item_on(&mut self, pos: BlockPos, face: Face);
    // ...
}
```

## Nächste Schritte

- [FlintBench](../flintbench/) - Test-Suite für Flint-Steel
- [FlintCLI](../flintcli/) - Alternativer Black-Box-Test-Ansatz
- [Server-Integration](../../integration) - Flint für andere Server implementieren
