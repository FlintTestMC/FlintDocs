---
title: Introduction to Flint
description: Overview of Flint, the Minecraft server testing framework
sidebar:
  order: 1
---

Flint is a Rust library that enables testing of Minecraft servers. With a declarative JSON format, server implementations can be tested deterministically and reproducibly.

## What is Flint?

Flint provides:

- **Declarative test format** - Tests are defined in JSON, not code
- **Timeline-based execution** - Actions execute at specific game ticks
- **Server-agnostic** - Flint defines the format, servers provide the implementation
- **Tag-based organization** - Tests can be categorized and filtered
- **Multiple output formats** - JSON, TAP, JUnit XML, or human-readable output

## Core Concepts

### Test Specifications

Each test is a JSON file containing:
- A **cleanup region** where all actions take place
- A **timeline** with actions (block placements, player interactions, assertions)
- Optional **player configuration** for inventory tests
- **Tags** for organization

### Adapter Pattern

Flint uses a trait-based design:

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

- **FlintAdapter** - Creates test worlds
- **FlintWorld** - Executes block operations and ticks
- **FlintPlayer** - Manages inventory and item interactions

### Timeline Execution

Tests run tick by tick:

1. Actions for the current tick are executed
2. The game tick is executed (`do_tick`)
3. Assertions verify the expected state

This guarantees deterministic, reproducible results.

## Next Steps

- [Quickstart](./quickstart/) - Write your first test
- [Test Format](./testformat/overview/) - Complete reference
- [Server Integration](./integration/) - Integrate Flint into your server
