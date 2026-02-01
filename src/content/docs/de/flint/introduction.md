---
title: Einführung in Flint
description: Überblick über Flint, das Minecraft Server Test-Framework
sidebar:
  order: 1
---

Flint ist eine Rust-Bibliothek, die das Testen von Minecraft-Servern ermöglicht. Mit einem deklarativen JSON-Format können Server-Implementierungen deterministisch und reproduzierbar getestet werden.

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

### Adapter-Pattern

Flint verwendet ein Trait-basiertes Design:

```
┌─────────────────────────────────────────────────────────┐
│                      Flint Core                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ TestLoader  │  │ TestRunner  │  │ ResultFormatter │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    Server Adapter                         │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ FlintAdapter │  │ FlintWorld │  │   FlintPlayer    │  │
│  └──────────────┘  └────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- **FlintAdapter** - Erstellt Test-Welten
- **FlintWorld** - Führt Block-Operationen und Ticks aus
- **FlintPlayer** - Verwaltet Inventar und Item-Interaktionen

### Timeline-Ausführung

Tests laufen Tick für Tick ab:

1. Aktionen für den aktuellen Tick werden ausgeführt
2. Der Game-Tick wird ausgeführt (`do_tick`)
3. Assertions prüfen den erwarteten Zustand

Das garantiert deterministische, reproduzierbare Ergebnisse.

## Repository

Flint Core ist Open Source: [github.com/FlintTestMC/flint-core](https://github.com/FlintTestMC/flint-core)

## Nächste Schritte

- [Schnellstart](./quickstart/) - Schreibe deinen ersten Test
- [Testformat](./testformat/overview/) - Vollständige Referenz
- [Integration](./integration/) - Integriere Flint in deinen Server
