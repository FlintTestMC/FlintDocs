---
title: Server-Integration
description: Wie du Flint in deinen Minecraft-Server integrierst
sidebar:
  order: 10
---

Dieser Guide erklärt, wie du Flint in deine Minecraft-Server-Implementierung integrierst.

## Übersicht

Flint verwendet ein Trait-basiertes Adapter-Pattern. Dein Server implementiert drei Traits:

- **FlintAdapter** - Erstellt Test-Welten
- **FlintWorld** - Block-Operationen und Tick-Ausführung
- **FlintPlayer** - Inventar und Item-Interaktionen

## Dependency hinzufügen

```toml
[dependencies]
flint-core = { git = "https://github.com/FlintTestMC/flint-core" }
```

## FlintAdapter implementieren

```rust
use flint_core::{FlintAdapter, FlintWorld, ServerInfo};

pub struct MeinServerAdapter;

impl FlintAdapter for MeinServerAdapter {
    fn create_test_world(&self) -> Box<dyn FlintWorld> {
        Box::new(MeineTestWelt::new())
    }

    fn server_info(&self) -> ServerInfo {
        ServerInfo { minecraft_version: "1.21.1".to_string() }
    }
}
```

## FlintWorld implementieren

```rust
impl FlintWorld for MeineTestWelt {
    fn do_tick(&mut self) {
        self.tick += 1;
        self.process_scheduled_ticks();
        self.process_block_updates();
    }

    fn current_tick(&self) -> u64 { self.tick }

    fn get_block(&self, pos: BlockPos) -> BlockData {
        // Block-State zurückgeben
    }

    fn set_block(&mut self, pos: BlockPos, block: &Block) {
        // Block setzen MIT Nachbar-Updates!
    }

    fn create_player(&mut self) -> Box<dyn FlintPlayer> {
        Box::new(MeinTestSpieler::new(self))
    }
}
```

**Wichtig:** `set_block` muss Nachbar-Updates auslösen!

## FlintPlayer implementieren

```rust
impl FlintPlayer for MeinTestSpieler {
    fn set_slot(&mut self, slot: PlayerSlot, item: Option<&Item>) { ... }
    fn get_slot(&self, slot: PlayerSlot) -> Option<Item> { ... }
    fn select_hotbar(&mut self, slot: u8) { ... }
    fn selected_hotbar(&self) -> u8 { ... }
    fn use_item_on(&mut self, pos: BlockPos, face: &BlockFace) { ... }
}
```

## Tests ausführen

```rust
let adapter = MeinServerAdapter;
let runner = TestRunner::new(&adapter);

let loader = TestLoader::new(Path::new("./tests"), true)?;
let files = loader.collect_all_test_files()?;

let specs: Vec<TestSpec> = files.iter()
    .filter_map(|f| TestSpec::from_file(f).ok())
    .collect();

let summary = runner.run_tests(&specs);
summary.print_concise_summary();
```

## Ausgabeformate

```rust
summary.print_concise_summary();  // Kompakt
summary.print_test_summary(80);   // Ausführlich
summary.print_json();             // JSON
summary.print_tap();              // TAP
summary.print_junit();            // JUnit XML
```

## Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `TEST_PATH` | `./test` | Basis-Verzeichnis |
| `INDEX_NAME` | `.cache/index.json` | Index-Datei |
| `DEFAULT_TAG` | `default` | Tag für ungetaggte Tests |
