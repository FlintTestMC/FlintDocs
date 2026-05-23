---
title: FlintCLI
description: Command-line tool for running Flint tests against Minecraft servers
sidebar:
  order: 1
---

FlintCLI is a command-line tool that connects to Minecraft servers to execute Flint tests. It uses `/tick freeze` and `/tick step` commands for deterministic, tick-accurate testing.

## Features

- **Server connection** - Connects as a bot to any Minecraft server (1.21.5+)
- **Deterministic execution** - Freezes game time for reproducible results
- **Multiple output formats** - Pretty, JSON, TAP, JUnit XML
- **Interactive mode** - Run tests via in-game chat commands
- **Test recording** - Record tests by playing in-game
- **Debugging** - Breakpoints and step-through execution
- **Shell completions** - Generate completions for supported shells
- **Event stream output** - Emit per-tick JSONL diffs for visualization tools

## Installation

### Prerequisites

- Rust nightly toolchain
- Minecraft server 1.21.5+ (vanilla, Paper, Spigot, etc.)
- Server with `online-mode=false` or bot whitelisted

### Building

```bash
git clone https://github.com/FlintTestMC/FlintCLI
cd FlintCLI
rustup override set nightly
cargo build --release
```

The binary will be at `target/release/flintmc`.

### Server Setup

The bot needs operator permissions:

```
/op flintmc_testbot
```

## Usage

### Basic Commands

Run a single test:

```bash
flintmc example_tests/basic_placement.json -s localhost:25565
```

Run all tests in a directory:

```bash
flintmc example_tests/ -s localhost:25565
```

Run tests recursively:

```bash
flintmc example_tests/ -s localhost:25565 -r
```

Filter by tags:

```bash
flintmc -s localhost:25565 -t redstone -t pistons
```

### Output Formats

```bash
# Human-readable (default)
flintmc tests/ -s localhost:25565

# JSON output
flintmc tests/ -s localhost:25565 --format json

# TAP format (CI/CD compatible)
flintmc tests/ -s localhost:25565 --format tap

# JUnit XML (Jenkins/GitHub Actions)
flintmc tests/ -s localhost:25565 --format junit > results.xml
```

### Verbose and Debug Modes

```bash
# Verbose output (per-action details)
flintmc tests/ -s localhost:25565 -v

# List tests without running
flintmc tests/ --list

# Dry run (show execution plan)
flintmc tests/ --dry-run

# Pause after setup for inspection
flintmc tests/ -s localhost:25565 --break-after-setup

# Generate shell completions
flintmc --completions zsh > _flintmc

# Emit per-tick JSONL events for one test
flintmc tests/basic.json -s localhost:25565 --emit-events run.jsonl
```

## Command-Line Options

| Flag | Short | Description |
|------|-------|-------------|
| `--server <SERVER>` | `-s` | Server address (required) |
| `--recursive` | `-r` | Search directories recursively |
| `--interactive` | `-i` | Interactive mode |
| `--verbose` | `-v` | Show detailed output |
| `--quiet` | `-q` | Suppress progress bar |
| `--tag <TAG>` | `-t` | Filter by tag (repeatable) |
| `--action-delay <MS>` | `-d` | Delay between actions (default: 100ms) |
| `--break-after-setup` | | Pause after test setup |
| `--fail-fast` | | Stop after first failure |
| `--list` | | List tests and exit |
| `--dry-run` | | Show plan without connecting |
| `--format <FORMAT>` | | Output: pretty, json, tap, junit |
| `--completions <SHELL>` | | Generate shell completions and exit |
| `--emit-events <PATH>` | | Write per-tick JSONL events; requires exactly one test file |

## Interactive Mode

Start interactive mode to control tests via in-game chat:

```bash
flintmc -s localhost:25565 -i
```

### Chat Commands

All commands are prefixed with `!`:

| Command | Description |
|---------|-------------|
| `!help` | List available commands |
| `!list` | List loaded tests |
| `!search <pattern>` | Search tests by name |
| `!run <name>` | Run a specific test |
| `!run <name> step` | Run a test and pause after every tick |
| `!run-all` | Run all tests |
| `!run-tags <tag1,tag2>` | Run tests by tags |
| `!reload` | Reload tests from disk |
| `!record <name>` | Start recording a test |
| `!tick` / `!next` | During recording, snapshot changes and advance one tick |
| `!assert <x> <y> <z>` | During recording, add a block assertion |
| `!assert_changes` | Convert current recorded block changes into assertions |
| `!sprint <ticks>` | During recording, tick repeatedly and re-assert the last assertion |
| `!save` | Save the current recording |
| `!cancel` | Discard the current recording |
| `!stop` | Exit interactive mode |

## Event JSONL

`--emit-events` is intended for tools that want to replay a real server run. It forces single-step execution, scans the test cleanup region after every tick, and writes newline-delimited events in test-local coordinates:

```json
{"type":"run_started","test":"basic","region":[[0,0,0],[2,2,2]]}
{"type":"tick","tick":1,"set":[{"pos":[0,0,0],"id":"minecraft:stone"}],"removed":[]}
{"type":"assert","tick":2,"pos":[0,0,0],"passed":true,"expected":"minecraft:stone","actual":"minecraft:stone"}
{"type":"run_completed","asserts_passed":1,"asserts_failed":0}
```

## Troubleshooting

**"Bot not initialized"**
Check that the server is running and accessible.

**"Bot needs op permissions"**
Run `/op flintmc_testbot` on the server.

**Assertion failures**
Try increasing the tick delay with `-d 200` or verify block names are correct.

**Connection timeout**
Verify firewall settings and whitelist configuration.

## Next Steps

- [Recording Tests](./recording/) - Create tests by playing in-game
- [Test Format](../../testformat/overview/) - Complete test specification reference
