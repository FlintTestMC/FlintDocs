---
title: Zu Flint beitragen
description: Wie du zum Flint-Projekt beitragen kannst
sidebar:
  order: 11
---

## Erste Schritte

### Voraussetzungen

- Rust (Edition 2024)
- Git

### Repository klonen

```bash
git clone https://github.com/FlintTestMC/flint-core.git
cd flint-core
cargo build
cargo test
```

## Projektstruktur

```
flint-core/
├── src/
│   ├── lib.rs           # Öffentliche API
│   ├── test_spec.rs     # Test-Schema
│   ├── traits.rs        # Core-Traits
│   ├── runner.rs        # Test-Engine
│   ├── loader.rs        # Datei-Erkennung
│   ├── index.rs         # Tag-Indexing
│   ├── results.rs       # Ergebnis-Typen
│   ├── timeline.rs      # Timeline-Aggregation
│   ├── format.rs        # Ausgabe-Formatierung
│   ├── spatial.rs       # Räumliche Utilities
│   └── utils.rs         # Hilfsfunktionen
└── Cargo.toml
```

## Code-Style

```bash
cargo fmt      # Formatierung
cargo clippy   # Linting
```

## Neue Features

### Neuer Aktionstyp

1. Variante zu `ActionType` in `test_spec.rs` hinzufügen
2. Handler in `runner.rs` implementieren
3. Validierung hinzufügen falls nötig
4. Tests schreiben
5. Dokumentation aktualisieren

## Pull-Request-Prozess

1. **Fork** das Repository
2. **Branch erstellen**: `git checkout -b feat/mein-feature`
3. **Änderungen** mit klaren Commits
4. **Tests**: `cargo test`
5. **Lints**: `cargo clippy && cargo fmt --check`
6. **PR öffnen** mit Beschreibung

### Commit-Messages

```
feat: neuen Aktionstyp hinzufügen
fix: Power-Level-Berechnung korrigieren
docs: Guide aktualisieren
test: Tests hinzufügen
```

## Lizenz

MIT-lizenziert. Mit deinem Beitrag stimmst du derselben Lizenz zu.
