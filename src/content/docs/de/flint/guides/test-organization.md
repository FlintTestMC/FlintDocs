---
title: Testorganisation
description: Wie du deine Tests strukturierst und organisierst
sidebar:
  order: 4
---

Eine gute Testorganisation macht Tests wartbar und auffindbar.

:::tip[FlintBench]
Alle Community-Tests, die Vanilla-Minecraft-Verhalten validieren, sollten zu [FlintBench](../../tools/flintbench/) beigetragen werden, der offiziellen Test-Sammlung. FlintBench folgt den in diesem Guide beschriebenen Organisationsmustern.
:::

## Verzeichnisstruktur

```
tests/
├── redstone/
│   ├── signal/
│   ├── repeater/
│   └── comparator/
├── bloecke/
│   ├── kupfer/
│   └── holz/
└── pistons/
```

## Namenskonventionen

### Dateinamen

```
[was]-[aktion]-[details].json
```

**Beispiele:**
- `redstone-signal-verliert-staerke.json`
- `kupfer-wird-gewachst.json`

### Testnamen

Beschreibt das erwartete Verhalten:
```json
{ "name": "Redstone-Signal verliert 1 Stärke pro Block" }
```

## Tag-System

```json
{ "tags": ["unit", "redstone", "repeater", "timing"] }
```

### Tag-Hierarchie

- `unit` / `integration` / `regression`
- `redstone` / `piston` / `copper`
- `fast` / `slow`

### Nach Tags filtern

```rust
let files = loader.collect_by_tags(&["redstone".to_string()])?;
```

## Test-Suites

### Smoke Tests

Schnelle Tests für Grundfunktionalität:

```json
{
  "name": "Smoke: Block-Platzierung funktioniert",
  "tags": ["smoke", "fast"]
}
```

### Regressionstests

```json
{
  "name": "Regression #42: Observer triggert nicht doppelt",
  "description": "Behebt: https://github.com/org/repo/issues/42",
  "tags": ["regression", "observer"]
}
```

## Index-System

Flint erstellt automatisch einen Index:

```json
{
  "hash": 8180331397721424639,
  "index": {
    "redstone": ["./tests/redstone/signal.json"],
    "default": ["./tests/untagged-test.json"]
  }
}
```

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `TEST_PATH` | `./test` | Basis-Verzeichnis |
| `INDEX_NAME` | `.cache/index.json` | Index-Datei |
| `DEFAULT_TAG` | `default` | Tag für ungetaggte Tests |
