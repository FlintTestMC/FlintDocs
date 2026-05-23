---
title: FlintBench
description: Die offizielle Test-Sammlung zur Validierung von Minecraft-Server-Verhalten
sidebar:
  order: 3
---

FlintBench ist das offizielle Repository mit allen Flint-Tests zur Validierung von Minecraft-Server-Verhalten gegen Vanilla. Von der Community erstellte Tests sollten hier beigetragen werden.

## Zweck

FlintBench bietet:

- **Vanilla-Verhaltens-Validierung** - Tests überprüfen, ob Server Vanilla Minecraft entsprechen
- **Compliance-Tracking** - Implementierungen mit Paper, Purpur, Spigot, Fabric vergleichen
- **Community-getriebene Tests** - Jeder kann neue Tests beitragen
- **Organisierte Test-Suite** - Tests nach Spielmechanik kategorisiert

## Repository

Der lokale Flint-Workspace teilt die Benchmark-Suite aktuell in mehrere Szenario-Suites auf:

| Suite | Tests |
|-------|------:|
| `main` | 47 |
| `bars` | 54 |
| `chain` | 54 |
| `panes` | 47 |
| `walls` | 48 |

Jede Suite legt Flint-JSON-Dateien in ihrem eigenen `tests/`-Ordner ab.

## Test-Organisation

Tests sind nach Mechanik-Typ organisiert:

```
tests/
├── connectible/          # Blöcke, die sich mit Nachbarn verbinden
│   ├── fences/           # Zaun-Platzierung und Reihenverbindungen
│   ├── walls/            # Mauer-Verbindungen und gemischte Nachbarn
│   ├── iron.json         # Eisengitter-Verbindungen
│   └── bars/             # Kupfer- und Eisenbar-Verhalten in der bars-Suite
│
├── fluids/               # Wasser- und Lava-Mechaniken
│   ├── mixing.json       # Lava + Wasser = Obsidian/Bruchstein
│   └── water/            # Wasser-Ausbreitung, Quellen, Falling-State, Stabilität
│
├── portal/nether/        # Netherportal-Erstellung und -Zerstörung
└── blocks/decoration/    # Suite-spezifische Blöcke wie Chain und Panes
```

## FlintBench-Tests ausführen

Benutze FlintCLI, um die Test-Suite auszuführen:

```bash
# Alle Tests ausführen
flintmc FlintBenchmark/main/tests/ -s localhost:25565 -r

# Nur Fluid-Tests ausführen
flintmc FlintBenchmark/main/tests/fluids/ -s localhost:25565 -r

# Tests nach Tag ausführen
flintmc FlintBenchmark/main/tests/ -s localhost:25565 -r -t water
```

## Tests beitragen

Wenn du Tests mit [FlintCLI-Aufnahme](./recording/) erstellst, trage sie zu FlintBench bei:

1. Forke das FlintBenchmark-Repository
2. Füge deinen Test zum passenden Kategorie-Ordner hinzu
3. Formatiere deinen Test: `npm run format`
4. Erstelle einen Pull Request

### Test-Anforderungen

- Tests müssen Vanilla-Minecraft-Verhalten validieren
- Verwende beschreibende Namen und Tags
- Füge eine klare Beschreibung hinzu
- Platziere im richtigen Kategorie-Ordner

### Formatierung

FlintBench verwendet FracturedJson für konsistente Formatierung:

```bash
npm install
npm run format        # Alle Tests formatieren
npm run format:check  # Formatierung überprüfen (wird in CI verwendet)
```

## Aktuelle Test-Abdeckung

| Kategorie | Abdeckung |
|-----------|-----------|
| Connectible | Zäune, Mauern, Bars, Panes, Chains, Eisengitter |
| Fluids | Wasser-Ausbreitung, Quellen, Falling-State, Replacement, Mixing |
| Portale | Netherportal-Erstellung und -Zerstörung |
| Dekorationsblöcke | Chain, Panes, Bars und suite-spezifische Varianten |

Siehe `TODO.md` im Repository für Blöcke, die noch Tests benötigen.

## Nächste Schritte

- [FlintCLI](./flintcli/) - Tests aus FlintBench ausführen
- [Tests aufnehmen](./recording/) - Neue Tests zum Beitragen erstellen
