---
title: Environment Variablen
description: Alle Environment Variables gelistet
sidebar:
  order: 12
---

# Umgebungsvariablen

## flint-core

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `TEST_PATH` | `./test` | Basis-Verzeichnis |
| `INDEX_NAME` | `.cache/index.json` | Index-Datei |
| `DEFAULT_TAG` | `default` | Tag für ungetaggte Tests |

## flint-steel

| Variable        | Example | Beschreibung                           |
| --------------- | -------- | -------------------------------------- |
| `FLINT_TEST`    |      `FLINT_TEST=water_falling_state`    | Spezifischen Test nach Namen ausführen |
| `FLINT_PATTERN` |    `FLINT_PATTERN=water`      | Nach Muster filtern im pfad            |
| `FLINT_TAGS`    |      `FLINT_TAGS=redstone,water`    | Nach Tags filtern                      |

