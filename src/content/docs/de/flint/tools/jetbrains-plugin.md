---
title: JetBrains Plugin
description: Flint Testing Suite für RustRover und JetBrains-IDEs
sidebar:
  order: 6
---

Die Flint Testing Suite integriert `flint-steel` und FlintViz in RustRover und andere JetBrains-IDEs mit Rust-Unterstützung. Das Plugin verwaltet einen lokalen `flint-steel`-Checkout, stellt Flint-Umgebungsvariablen ein und delegiert Runs an den Cargo-Runner des Rust-Plugins.

## Voraussetzungen

- RustRover oder eine JetBrains-IDE mit Rust-Plugin.
- Rust und Cargo müssen für den IDE-Prozess verfügbar sein.
- Zugriff auf das konfigurierte `flint-steel`-Repository.
- Ein SteelMC- oder Flint-kompatibler Rust-Workspace für Run/Debug-Konfigurationen.

Das Plugin bündelt Linux-x86-64- und Windows-x86-64-Hilfsprogramme für `flint-index` und `flint-viz`.

## Einstellungen

Öffne `Settings/Preferences > Tools > Flint`.

| Einstellung | Umgebungsvariable | Zweck |
|-------------|-------------------|-------|
| Index file | `INDEX_NAME` | Von `flint-index` geschriebener Testindex |
| Default tag | `DEFAULT_TAG` | Tag für Tests ohne Tags |
| Test path | `TEST_PATH` | Flint-JSON-Testordner |
| Test name | `FLINT_TEST` | Einzeltest-Filter |
| Tags | `FLINT_TAGS` | Kommagetrennter Tag-Filter |
| Pattern | `FLINT_PATTERN` | Einfaches `*`-Pattern |
| Visualizer URL | `FLINT_VIZ_URL` | Basis-URL für flint-viz-Fehlerlinks |

Die Tag-Auswahl ist durchsuchbar. `Refresh tags` führt das gebündelte `flint-index` gegen `TEST_PATH` aus und befüllt die Auswahl aus dem generierten Index.

Wenn das rohe Feld `FLINT_TAGS` nicht leer ist, überschreibt es die ausgewählten Tags. Sonst werden die angehakten Tags verbunden und als `FLINT_TAGS` gesetzt.

## Flint Run Configuration

Eine `Flint`-Run-Configuration startet `flint-steel`-Tests.

| Modus | Verhalten |
|-------|-----------|
| Selected | Nutzt `FLINT_TEST`, `FLINT_TAGS` oder `FLINT_PATTERN` aus der Run-Configuration und danach globale Einstellungen |
| All | Entfernt `FLINT_TEST`, `FLINT_TAGS` und `FLINT_PATTERN`, damit alle Tests laufen |

Run verwendet das Cargo-Profil `dev`. Debug verwendet das Profil `flint` und delegiert an LLDB-Unterstützung des Rust-Plugins. Das Plugin hängt den verwalteten `flint-steel`-Checkout als Cargo-Projekt an und schreibt Cargo-Patch-Konfiguration, wenn ein lokaler `flint-core`-Override gesetzt ist.

Filter-Priorität:

1. Textfelder der Run-Configuration
2. Ausgewählte Tags der Run-Configuration
3. Globale Flint-Einstellungen
4. `.env` und `flint.toml` aus `flint-steel`

Wenn `FLINT_VIZ_URL` leer ist, wird sie aus der ausgewählten oder ersten `Flint Viz`-Run-Configuration abgeleitet, sonst aus `http://127.0.0.1:7878`.

## Flint Viz Run Configuration

Eine `Flint Viz`-Run-Configuration startet den lokalen Visualizer.

| Modus | Verhalten |
|-------|-----------|
| Test folder | Serviert den `TEST_PATH`-Ordner des geöffneten Projekts |
| Readonly | Startet ohne Testordner, nützlich für eingebettete Fehlerlinks |

Host und Port werden vor dem Start geprüft. Wenn der Port belegt ist, schlägt die Konfiguration fehl, ohne den existierenden Prozess zu beenden.

## Verwaltete Dateien

Der verwaltete `flint-steel`-Checkout liegt im IDE-Systemordner unter `flint-plugin/flint-steel`. Der Standardindex liegt unter `flint-plugin/.cache/index.json`.
