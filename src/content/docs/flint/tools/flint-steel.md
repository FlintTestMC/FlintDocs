---
title: Flint-Steel
description: White-box Flint adapter for SteelMC server testing
sidebar:
  order: 4
---

Flint-Steel is the official Flint adapter for [SteelMC](https://github.com/Steel-Foundation/SteelMC), enabling white-box testing of the Minecraft server implementation. Unlike FlintCLI's black-box approach, Flint-Steel runs tests directly against Steel's code.

## Overview

Flint-Steel provides:

- **Direct code testing** - Tests run against actual Steel server code, not via network
- **No server required** - Tests execute in-process without a running server
- **Full accuracy** - Uses real block behaviors, fluid dynamics, and game mechanics
- **Fast execution** - No network overhead, RAM-only world storage

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Flint Core                         │
│         (Test specs, loader, JSON parsing)              │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Flint-Steel                         │
│  ┌──────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │ SteelAdapter │  │ SteelWorld │  │  SteelPlayer   │  │
│  └──────────────┘  └────────────┘  └────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Steel Core                         │
│            (Block behaviors, world, ticks)              │
└─────────────────────────────────────────────────────────┘
```

## Usage

### In Rust Tests

```rust
use steel_flint::{SteelAdapter, TestLoader, TestRunner};

#[test]
fn run_flint_tests() {
    // Initialize Steel systems
    steel_flint::init();

    // Load tests from FlintBench
    let loader = TestLoader::new(get_test_path(), true).unwrap();
    let specs = loader.collect_all().unwrap();

    // Run tests
    let adapter = SteelAdapter::new();
    let runner = TestRunner::new(&adapter);
    let summary = runner.run_tests(&specs);

    assert_eq!(summary.failed_tests, 0);
}
```

### Environment Variables

Filter tests using environment variables, more information can be found [here](../../ENV):

```bash
# Run specific test by name
FLINT_TEST=water_falling_state cargo test

# Filter by pattern
FLINT_PATTERN=water cargo test

# Filter by tags
FLINT_TAGS=redstone,water cargo test
```

### Running via Cargo

```bash
# Run all Flint tests
cargo test --package steel-flint

# Run with specific tags
FLINT_TAGS=connectible cargo test --package steel-flint
```

## How It Works

### World Creation

Flint-Steel creates test worlds with:

- **Empty chunk generator** - Chunks created on-demand, no disk I/O
- **RAM-only storage** - Fast, isolated test environments
- **Full behavior systems** - Real redstone, fluids, block updates

### Player Simulation

For tests requiring player interactions (`use_item_on`, inventory):

- Synthetic player identities
- Full inventory management
- Block interaction simulation
- No network connection needed

### Test Execution

1. World created with cleanup region
2. Timeline actions executed tick-by-tick
3. `do_tick()` advances game state
4. Assertions verify block states
5. World destroyed after test

## Comparison with FlintCLI

| Feature | Flint-Steel | FlintCLI |
|---------|-------------|----------|
| Testing type | White-box | Black-box |
| Server required | No | Yes |
| Network overhead | None | Yes |
| Works with any server | No (Steel only) | Yes |
| Debug access | Full | Limited |
| Speed | Very fast | Slower |

**Use Flint-Steel when:**
- Developing SteelMC
- Need fast test iteration
- Want debugger access
- Testing internal behaviors

**Use FlintCLI when:**
- Testing any Minecraft server
- Validating against vanilla
- CI/CD with real servers
- Comparing implementations

## Integration with FlintBench

Flint-Steel can run tests from [FlintBench](../flintbench/), before hend the env variable `TEST_PATH` more information can be found [here](../../ENV) or hardcode the link (not recommended):

```rust
let loader = TestLoader::new(get_test_path(), true)?;
let specs = loader.collect_by_tags(&["water", "connectible"])?;

let adapter = SteelAdapter::new();
let runner = TestRunner::new(&adapter);
let summary = runner.run_tests(&specs);
```

## Implementing for Other Servers

Other Minecraft server implementations can create their own Flint adapters by implementing the traits:

```rust
pub trait FlintAdapter {
    type World: FlintWorld;
    fn create_world(&self, cleanup_region: Region) -> Self::World;
}

pub trait FlintWorld {
    fn place_block(&mut self, pos: BlockPos, block: &BlockSpec);
    fn get_block(&self, pos: BlockPos) -> BlockSpec;
    fn do_tick(&mut self);
    // ...
}

pub trait FlintPlayer {
    fn set_slot(&mut self, slot: Slot, item: ItemStack);
    fn use_item_on(&mut self, pos: BlockPos, face: Face);
    // ...
}
```

## Next Steps

- [FlintBench](./flintbench/) - Test suite to run with Flint-Steel
- [FlintCLI](./flintcli/) - Alternative black-box testing approach
- [Server Integration](../integration/) - Implementing Flint for other servers
