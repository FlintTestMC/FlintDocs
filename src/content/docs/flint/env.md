---
title: Environment variables
description: Alle Environment Variables gelistst
sidebar:
  order: 12
---

# Environment Variables

## flint-core

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `TEST_PATH` | `./test` | Basis-path |
| `INDEX_NAME` | `.cache/index.json` | Index-file |
| `DEFAULT_TAG` | `default` | Tag for untagged tests |

## flint-steel

| Variable        | Example                          | Beschreibung              |
| --------------- | -------------------------------- | ------------------------- |
| `FLINT_TEST`    | `FLINT_TEST=water_falling_state` | Run specific test by name |
| `FLINT_PATTERN` | `FLINT_PATTERN=water`            | Filter by pattern         |
| `FLINT_TAGS`    | `FLINT_TAGS=redstone,water`      | Filter by tags            |
