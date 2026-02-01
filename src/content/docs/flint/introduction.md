---
title: Introduction to Flint
description: Overview of Flint, the Minecraft server testing framework
sidebar:
  order: 1
---

Flint is a testing framework for Minecraft servers. It consists of four main components:

- **Flint Core** - A Rust library that defines the test format and provides the execution engine
- **FlintCLI** - A command-line tool that runs tests against live Minecraft servers (black-box testing)
- **Flint-Steel** - The Flint adapter for SteelMC enabling white-box testing
- **FlintBench** - The official test collection for validating vanilla Minecraft behavior

With a declarative JSON format, server implementations can be tested deterministically and reproducibly.

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


### Timeline Execution

Tests run tick by tick:

1. Actions for the current tick are executed
2. The game tick is executed (`do_tick`)
3. Assertions verify the expected state

This guarantees deterministic, reproducible results.

## Next Steps

- [Quickstart](../quickstart/) - Write your first test
- [FlintCLI](../tools/flintcli/) - Run tests with the CLI tool (black-box)
- [Flint-Steel](../tools/flint-steel/) - Run tests directly in SteelMC (white-box)
- [FlintBench](../tools/flintbench/) - Browse and run the official test suite
- [Test Format](../testformat/overview/) - Complete reference
- [Server Integration](../integration/) - Integrate Flint into your server
