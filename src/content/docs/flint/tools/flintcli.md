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
| `!run-all` | Run all tests |
| `!run-tags <tag1,tag2>` | Run tests by tags |
| `!reload` | Reload tests from disk |
| `!record <name>` | Start recording a test |
| `!stop` | Exit interactive mode |

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

- [Recording Tests](../recording/) - Create tests by playing in-game
- [Test Format](../../testformat/overview/) - Complete test specification reference
