---
title: Tests aufnehmen
description: Flint-Tests erstellen durch Aufnahme deiner Aktionen im Spiel
sidebar:
  order: 2
---

FlintCLI enthält einen Aufnahme-Modus, der deine In-Game-Aktionen erfasst und automatisch Testdateien generiert. Das ist der schnellste Weg, Tests zu erstellen, ohne JSON manuell zu schreiben.

## Aufnahme starten

1. Starte FlintCLI im interaktiven Modus:

```bash
flintmc -s localhost:25565 -i
```

2. Im Spiel den Aufnahme-Befehl eingeben:

```
!record mein_test_name
```

3. Der Bot wird ankündigen, dass die Aufnahme gestartet wurde und die Spielzeit einfrieren.

## Aufnahme-Workflow

Nach dem Start der Aufnahme:

1. **Blöcke platzieren** - Alle Block-Änderungen werden mit ihrem Tick-Timing erfasst
2. **Ticks voranschreiten** - Benutze `!tick` oder `!tick <anzahl>` um vorwärts zu gehen
3. **Assertions hinzufügen** - Benutze `!assert` um aktuelle Block-Zustände zu überprüfen
4. **Test speichern** - Benutze `!save` wenn fertig

## Aufnahme-Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `!tick` | Einen Game-Tick voranschreiten |
| `!tick <n>` | n Game-Ticks voranschreiten |
| `!assert` | Alle Änderungen seit letztem Assert prüfen |
| `!assert_changes` | Nur geänderte Blöcke prüfen |
| `!save` | Aufnahme speichern und beenden |
| `!cancel` | Aufnahme verwerfen |

## Beispiel-Aufnahme-Session

```
Spieler: !record fence_test
Bot: Aufnahme gestartet für 'fence_test'. Spielzeit eingefroren.

[Spieler platziert einen Eichenzaun bei 0, 100, 0]

Spieler: !tick
Bot: Tick 1

[Spieler platziert einen Steinblock neben dem Zaun bei 1, 100, 0]

Spieler: !tick
Bot: Tick 2

Spieler: !assert
Bot: 2 Assertions bei Tick 2 hinzugefügt

Spieler: !save
Bot: Test gespeichert als fence_test.json
```

## Generierte Test-Struktur

Die Aufnahme generiert eine vollständige Testdatei:

```json
{
  "flintVersion": "0.1",
  "name": "fence_test",
  "setup": {
    "cleanup": {
      "region": [[-5, 95, -5], [5, 105, 5]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 100, 0],
      "block": { "id": "minecraft:oak_fence" }
    },
    {
      "at": 1,
      "do": "place",
      "pos": [1, 100, 0],
      "block": { "id": "minecraft:stone" }
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 100, 0], "is": { "id": "minecraft:oak_fence", "state": { "east": "true" } } },
        { "pos": [1, 100, 0], "is": { "id": "minecraft:stone" } }
      ]
    }
  ]
}
```

## Tipps

### Cleanup-Region

Die Aufnahme berechnet automatisch eine Cleanup-Region, die alle platzierten Blöcke mit Polsterung umfasst. Du kannst dies in der generierten JSON-Datei bei Bedarf anpassen.

### Tick-Timing

- Benutze `!tick` häufig, um präzises Timing zu erfassen
- Redstone-Mechaniken brauchen oft mehrere Ticks zur Ausbreitung
- Wasser- und Lava-Fluss benötigt viele Ticks (prüfe das Timing in generierten Tests)

### Assertions

- `!assert` erfasst den vollständigen Zustand aller platzierten Blöcke
- `!assert_changes` erfasst nur Blöcke, die sich seit der letzten Assertion geändert haben
- Du kannst mehrere Assertions zu verschiedenen Tick-Zeitpunkten hinzufügen

### Generierte Tests bearbeiten

Die Aufnahme erstellt einen guten Ausgangspunkt, aber du möchtest vielleicht:

- Tags zur Organisation hinzufügen
- Eine Beschreibung hinzufügen
- Die Cleanup-Region anpassen
- Breakpoints zum Debuggen hinzufügen

## Zu FlintBench beitragen

Tests, die Vanilla-Minecraft-Verhalten validieren, sollten zu [FlintBench](../flintbench/) beigetragen werden, der offiziellen Test-Sammlung. Nach dem Aufnehmen eines Tests:

1. Forke das FlintBenchmark-Repository
2. Platziere deinen Test im passenden Kategorie-Ordner
3. Führe `npm run format` aus, um das JSON zu formatieren
4. Erstelle einen Pull Request

## Nächste Schritte

- [FlintBench](../flintbench/) - Trage deine Tests zur offiziellen Sammlung bei
- [FlintCLI-Referenz](../flintcli/) - Vollständige Befehlsreferenz
- [Testformat](../../testformat/overview/) - Das generierte JSON-Format verstehen
