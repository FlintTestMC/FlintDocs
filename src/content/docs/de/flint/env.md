---
title: Umgebungsvariablen
description: Umgebungsvariablen der Flint-Werkzeuge
sidebar:
  order: 12
---

## flint-core

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `TEST_PATH` | `./test` | Basisordner für Flint-JSON-Tests |
| `INDEX_NAME` | `.cache/index.json` | Pfad zum generierten Testindex |
| `DEFAULT_TAG` | `default` | Tag für Tests ohne eigene Tags |

## flint-steel

`flint-steel` liest `.env` über `dotenvy` und verwendet danach Defaults aus `flint.toml`. Umgebungsvariablen haben Vorrang.

| Variable | Beispiel | Beschreibung |
|----------|----------|--------------|
| `FLINT_TEST` | `FLINT_TEST=water_falling_state` | Führt genau den Test aus, dessen Dateiname ohne Endung passt |
| `FLINT_PATTERN` | `FLINT_PATTERN="water*"` | Führt Tests aus, deren Dateiname zu einem einfachen `*`-Pattern passt |
| `FLINT_TAGS` | `FLINT_TAGS=redstone,water` | Führt Tests mit kommagetrennten Tags aus |
| `FLINT_VIZ_URL` | `FLINT_VIZ_URL=http://localhost:7878` | Basis-URL für gedruckte flint-viz-Fehlerlinks |

Filter-Priorität:

1. `FLINT_TEST`
2. `FLINT_PATTERN`
3. `FLINT_TAGS`
4. `flint.toml` `implemented_only`
5. `flint.toml` `[filter.tags]`
6. alle Tests

## flint.toml

Persistente Filter können in `flint.toml` stehen:

```toml
viz_url = "http://localhost:7878"

[filter]
implemented_only = true
test = "place_fence"
pattern = "fence*"

[filter.tags]
redstone = true
walls = false
```

`implemented_only` erzeugt eine Tag-Liste aus Steels nicht-standardmäßigen Block- und Item-Behavior-Registries.

## JetBrains Plugin

Die Flint Testing Suite schreibt dieselben Variablen in gestartete `flint-steel`-Cargo-Prozesse. Im Selected-Modus gewinnen Run-Configuration-Overrides vor globalen Einstellungen; im All-Modus entfernt das Plugin `FLINT_TEST`, `FLINT_TAGS` und `FLINT_PATTERN`.
