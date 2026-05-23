---
title: FlintViz
description: Lokaler Visualizer für Flint-Testdateien und Fehlerlinks
sidebar:
  order: 5
---

FlintViz ist eine lokale Weboberfläche für Flint-JSON-Tests. Sie zeigt JSON-Quelle, 3D-Blockansicht, Timeline, Inventarstatus, Assertions und Quellverweise in einer geteilten Ansicht.

## Installation

```bash
git clone https://github.com/FlintTestMC/FlintViz
cd FlintViz
cargo xtask build
./target/x86_64-unknown-linux-gnu/release/flint-viz serve ./path/to/tests --open
```

Oder per Cargo:

```bash
cargo install --git https://github.com/FlintTestMC/FlintViz \
  --features embed-frontend \
  flint-viz
```

Der eingebettete Frontend-Build benötigt Node.js und npm im `PATH`.

## Verwendung

```bash
flint-viz serve <PATH>
```

| Option | Beschreibung |
|--------|--------------|
| `<PATH>` | Ordner, der rekursiv nach Flint-JSON-Tests durchsucht wird; Standard ist der aktuelle Ordner |
| `--host <IP>` | Bind-Adresse; Standard `127.0.0.1` |
| `--port <N>` | Port; Standard `7878` |
| `--open` | Browser nach Start öffnen |

Öffne `http://localhost:7878`, wähle einen Test in der Seitenleiste und scrubbe durch die Timeline.

## Interaktive Links

- Timeline-Marker öffnen den passenden `timeline[N]`-Eintrag im Editor.
- Ein Klick auf einen gerenderten Block öffnet den Eintrag, der ihn platziert oder zuletzt geändert hat.
- Der Editor-Cursor hebt passende Ticks hervor.
- Assertion-Zeilen springen zum Quell-Eintrag und können die Kamera zur Position bewegen.

## Minecraft-Assets

Die 3D-Ansicht nutzt Vanilla-Modelle und Texturen. Sie liegen nicht im Repository. Erzeuge das lokale Asset-Bundle einmalig:

```bash
cd frontend
npm install
npm run assets
```

## Fehlerlinks

`flint-steel` druckt bei fehlgeschlagenen Tests `Open in flint-viz:`-Links. Die Basis-URL kommt aus `FLINT_VIZ_URL`, danach aus `flint.toml` `viz_url`, danach aus `http://localhost:7878`.

```bash
flint-viz serve ./test --open
```

Danach kann ein `flint-steel`-Fehler direkt mit Test-Spec und Assertion-Payload im Visualizer geöffnet werden.

## Grenzen

- FlintViz spielt die Test-Spec statisch ab und simuliert keine vollständige Minecraft-Logik.
- Es ersetzt keine echte Ausführung mit FlintCLI oder flint-steel.
- Recording passiert in FlintCLI, nicht in FlintViz.
