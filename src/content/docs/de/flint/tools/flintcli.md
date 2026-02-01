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
| `!run-all` | Alle Tests ausführen |
| `!run-tags <tag1,tag2>` | Tests nach Tags ausführen |
| `!reload` | Tests von der Festplatte neu laden |
| `!record <name>` | Test-Aufnahme starten |
| `!stop` | Interaktiven Modus beenden |

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
- [Testformat](../testformat/overview/) - Vollständige Testformat-Referenz
