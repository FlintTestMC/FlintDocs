---
title: Einführung in Flint
description: Überblick über Flint, das Minecraft Server Test-Framework
sidebar:
  order: 1
---

Flint ist ein Test-Framework für Minecraft-Server. Es besteht aus drei Hauptkomponenten:

- **Flint Core** - Eine Rust-Bibliothek, die das Testformat definiert und die Ausführungsengine bereitstellt
- **FlintCLI** - Ein Kommandozeilen-Tool, das Tests gegen laufende Minecraft-Server ausführt
- **FlintBench** - Die offizielle Test-Sammlung zur Validierung von Vanilla-Minecraft-Verhalten

Mit einem deklarativen JSON-Format können Server-Implementierungen deterministisch und reproduzierbar getestet werden.

## Was ist Flint?

Flint bietet:

- **Deklaratives Testformat** - Tests werden in JSON definiert, nicht in Code
- **Timeline-basierte Ausführung** - Aktionen werden zu bestimmten Game-Ticks ausgeführt
- **Server-unabhängig** - Flint definiert das Format, Server liefern die Implementierung
- **Tag-basierte Organisation** - Tests können kategorisiert und gefiltert werden
- **Mehrere Ausgabeformate** - JSON, TAP, JUnit XML oder lesbare Ausgabe

## Kernkonzepte

### Test-Spezifikationen

Jeder Test ist eine JSON-Datei mit:
- Einer **Cleanup-Region**, in der alle Aktionen stattfinden
- Einer **Timeline** mit Aktionen (Block-Platzierungen, Spieler-Interaktionen, Assertions)
- Optionaler **Spieler-Konfiguration** für Inventar-Tests
- **Tags** zur Organisation

### Timeline-Ausführung

Tests laufen Tick für Tick ab:

1. Aktionen für den aktuellen Tick werden ausgeführt
2. Der Game-Tick wird ausgeführt (`do_tick`)
3. Assertions prüfen den erwarteten Zustand

Das garantiert deterministische, reproduzierbare Ergebnisse.

## Repository

Flint Core ist Open Source: [github.com/FlintTestMC/flint-core](https://github.com/FlintTestMC/flint-core)

## Nächste Schritte

- [Schnellstart](../quickstart/) - Schreibe deinen ersten Test
- [FlintCLI](../tools/flintcli/) - Tests mit dem CLI-Tool ausführen
- [FlintBench](../tools/flintbench/) - Die offizielle Test-Suite durchsuchen und ausführen
- [Testformat](../testformat/overview/) - Vollständige Referenz
- [Integration](../integration/) - Integriere Flint in deinen Server
