---
title: FlintCLI
description: Kommandozeilen-Tool zum Ausführen von Flint-Tests gegen Minecraft-Server
sidebar:
  order: 1
---

FlintCLI ist ein Kommandozeilen-Tool, das sich mit Minecraft-Servern verbindet, um Flint-Tests auszuführen. Es verwendet `/tick freeze` und `/tick step` Befehle für deterministische, tick-genaue Tests.

## Funktionen

- **Server-Verbindung** - Verbindet sich als Bot mit jedem Minecraft-Server (1.21.5+)
- **Deterministische Ausführung** - Friert die Spielzeit für reproduzierbare Ergebnisse ein
- **Mehrere Ausgabeformate** - Pretty, JSON, TAP, JUnit XML
- **Interaktiver Modus** - Tests über In-Game-Chat-Befehle ausführen
- **Test-Aufnahme** - Tests durch Spielen im Spiel aufnehmen
- **Debugging** - Breakpoints und schrittweise Ausführung
- **Shell-Completions** - Completions für unterstützte Shells generieren
- **Event-Stream** - Tick-Diffs als JSONL für Visualisierungstools ausgeben

## Installation

### Voraussetzungen

- Rust nightly Toolchain
- Minecraft-Server 1.21.5+ (Vanilla, Paper, Spigot, etc.)
- Server mit `online-mode=false` oder Bot auf Whitelist

### Kompilieren

```bash
git clone https://github.com/FlintTestMC/FlintCLI
cd FlintCLI
rustup override set nightly
cargo build --release
```

Die Binary befindet sich unter `target/release/flintmc`.

### Server-Einrichtung

Der Bot benötigt Operator-Rechte:

```
/op flintmc_testbot
```

## Verwendung

### Grundlegende Befehle

Einen einzelnen Test ausführen:

```bash
flintmc example_tests/basic_placement.json -s localhost:25565
```

Alle Tests in einem Verzeichnis ausführen:

```bash
flintmc example_tests/ -s localhost:25565
```

Tests rekursiv ausführen:

```bash
flintmc example_tests/ -s localhost:25565 -r
```

Nach Tags filtern:

```bash
flintmc -s localhost:25565 -t redstone -t pistons
```

### Ausgabeformate

```bash
# Lesbar (Standard)
flintmc tests/ -s localhost:25565

# JSON-Ausgabe
flintmc tests/ -s localhost:25565 --format json

# TAP-Format (CI/CD-kompatibel)
flintmc tests/ -s localhost:25565 --format tap

# JUnit XML (Jenkins/GitHub Actions)
flintmc tests/ -s localhost:25565 --format junit > results.xml
```

### Verbose- und Debug-Modi

```bash
# Ausführliche Ausgabe (Details pro Aktion)
flintmc tests/ -s localhost:25565 -v

# Tests auflisten ohne auszuführen
flintmc tests/ --list

# Probelauf (Ausführungsplan anzeigen)
flintmc tests/ --dry-run

# Nach Setup pausieren zur Inspektion
flintmc tests/ -s localhost:25565 --break-after-setup

# Shell-Completions generieren
flintmc --completions zsh > _flintmc

# Tick-Events für einen Test schreiben
flintmc tests/basic.json -s localhost:25565 --emit-events run.jsonl
```

## Kommandozeilen-Optionen

| Flag | Kurz | Beschreibung |
|------|------|--------------|
| `--server <SERVER>` | `-s` | Server-Adresse (erforderlich) |
| `--recursive` | `-r` | Verzeichnisse rekursiv durchsuchen |
| `--interactive` | `-i` | Interaktiver Modus |
| `--verbose` | `-v` | Detaillierte Ausgabe |
| `--quiet` | `-q` | Fortschrittsbalken unterdrücken |
| `--tag <TAG>` | `-t` | Nach Tag filtern (wiederholbar) |
| `--action-delay <MS>` | `-d` | Verzögerung zwischen Aktionen (Standard: 100ms) |
| `--break-after-setup` | | Nach Test-Setup pausieren |
| `--fail-fast` | | Nach erstem Fehler stoppen |
| `--list` | | Tests auflisten und beenden |
| `--dry-run` | | Plan anzeigen ohne Verbindung |
| `--format <FORMAT>` | | Ausgabe: pretty, json, tap, junit |
| `--completions <SHELL>` | | Shell-Completions generieren und beenden |
| `--emit-events <PATH>` | | Tick-Events als JSONL schreiben; benötigt genau eine Testdatei |

## Interaktiver Modus

Starte den interaktiven Modus, um Tests über In-Game-Chat zu steuern:

```bash
flintmc -s localhost:25565 -i
```

### Chat-Befehle

Alle Befehle beginnen mit `!`:

| Befehl | Beschreibung |
|--------|--------------|
| `!help` | Verfügbare Befehle auflisten |
| `!list` | Geladene Tests auflisten |
| `!search <pattern>` | Tests nach Name suchen |
| `!run <name>` | Einen bestimmten Test ausführen |
| `!run <name> step` | Test ausführen und nach jedem Tick pausieren |
| `!run-all` | Alle Tests ausführen |
| `!run-tags <tag1,tag2>` | Tests nach Tags ausführen |
| `!reload` | Tests von der Festplatte neu laden |
| `!record <name>` | Test-Aufnahme starten |
| `!tick` / `!next` | Bei Aufnahme Änderungen erfassen und einen Tick weitergehen |
| `!assert <x> <y> <z>` | Bei Aufnahme einen Blockzustand als Assertion erfassen |
| `!assert_changes` | Aktuelle Blockänderungen in Assertions umwandeln |
| `!sprint <ticks>` | Bei Aufnahme wiederholt ticken und die letzte Assertion erneut prüfen |
| `!save` | Aktuelle Aufnahme speichern |
| `!cancel` | Aktuelle Aufnahme verwerfen |
| `!stop` | Interaktiven Modus beenden |

## Event JSONL

`--emit-events` ist für Tools gedacht, die einen echten Serverlauf nachspielen wollen. Es erzwingt Single-Step-Ausführung, scannt nach jedem Tick die Cleanup-Region und schreibt Events in testlokalen Koordinaten:

```json
{"type":"run_started","test":"basic","region":[[0,0,0],[2,2,2]]}
{"type":"tick","tick":1,"set":[{"pos":[0,0,0],"id":"minecraft:stone"}],"removed":[]}
{"type":"assert","tick":2,"pos":[0,0,0],"passed":true,"expected":"minecraft:stone","actual":"minecraft:stone"}
{"type":"run_completed","asserts_passed":1,"asserts_failed":0}
```

## Fehlerbehebung

**"Bot not initialized"**
Prüfe, ob der Server läuft und erreichbar ist.

**"Bot needs op permissions"**
Führe `/op flintmc_testbot` auf dem Server aus.

**Assertion-Fehler**
Versuche die Tick-Verzögerung mit `-d 200` zu erhöhen oder überprüfe die Block-Namen.

**Verbindungs-Timeout**
Überprüfe Firewall-Einstellungen und Whitelist-Konfiguration.

## Nächste Schritte

- [Tests aufnehmen](./recording/) - Tests durch Spielen im Spiel erstellen
- [Testformat](../../testformat/overview/) - Vollständige Testformat-Referenz
