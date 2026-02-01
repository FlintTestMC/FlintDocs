---
title: Server Integration
description: How to integrate Flint into your Minecraft server
sidebar:
  order: 10
---

This guide explains how to integrate Flint into your Minecraft server implementation.
The used environment variables can be found [here](../../ENV)

## Overview

Flint uses a trait-based adapter pattern. Your server implements three traits:

```
┌────────────────────────────────────────────────────────┐
│                     Your Server                        │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │ FlintAdapter │  │ FlintWorld │  │ FlintPlayer  │   │
│  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘   │
└─────────┼────────────────┼─────────────────┼──────────┘
          │                │                 │
          ▼                ▼                 ▼
┌────────────────────────────────────────────────────────┐
│                     Flint Core                         │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ TestLoader  │  │ TestRunner  │  │ ResultFormat  │  │
│  └─────────────┘  └─────────────┘  └───────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Add Dependency

```toml
[dependencies]
flint-core = { git = "https://github.com/FlintTestMC/flint-core" }
```

## Implement FlintAdapter

The adapter is the entry point that creates test worlds.

```rust
use flint_core::{FlintAdapter, FlintWorld, ServerInfo};

pub struct MyServerAdapter {
    // Server configuration
}

impl FlintAdapter for MyServerAdapter {
    fn create_test_world(&self) -> Box<dyn FlintWorld> {
        // Create a disposable in-memory world
        Box::new(MyTestWorld::new())
    }

    fn server_info(&self) -> ServerInfo {
        ServerInfo {
            minecraft_version: "1.21.1".to_string(),
        }
    }
}
```

**Requirements:**
- Test worlds must be disposable (no persistence)
- Each test gets a fresh world instance
- Worlds should be lightweight and fast to create

## Implement FlintWorld

The world trait provides block operations and tick execution.

```rust
use flint_core::{FlintWorld, FlintPlayer, Block, BlockPos};
use flint_core::traits::BlockData;
use rustc_hash::FxHashMap;

pub struct MyTestWorld {
    tick: u64,
    blocks: HashMap<BlockPos, BlockState>,
}

impl FlintWorld for MyTestWorld {
    fn do_tick(&mut self) {
        // Execute exactly one game tick
        self.tick += 1;

        // Process scheduled ticks (repeaters, observers, etc.)
        self.process_scheduled_ticks();

        // Process block updates
        self.process_block_updates();
    }

    fn current_tick(&self) -> u64 {
        self.tick
    }

    fn get_block(&self, pos: BlockPos) -> BlockData {
        let state = self.blocks.get(&pos).unwrap_or(&BlockState::AIR);

        BlockData {
            id: state.block_id().to_string(),
            properties: state.properties_as_map(),
        }
    }

    fn set_block(&mut self, pos: BlockPos, block: &Block) {
        // Parse block from Flint format
        let state = BlockState::from_flint(block);

        // Set block WITH neighbor updates (important!)
        self.set_block_with_updates(pos, state);
    }

    fn create_player(&mut self) -> Box<dyn FlintPlayer> {
        Box::new(MyTestPlayer::new(self))
    }
}
```

### Block Updates (Critical!)

`set_block` must trigger neighbor updates. This is essential for redstone, falling blocks, and other mechanics:

```rust
fn set_block_with_updates(&mut self, pos: BlockPos, state: BlockState) {
    let old_state = self.blocks.insert(pos, state.clone());

    // Notify the block itself
    state.on_place(self, pos);

    // Notify all 6 neighbors
    for face in BlockFace::all() {
        let neighbor_pos = pos.offset(face);
        if let Some(neighbor) = self.blocks.get(&neighbor_pos) {
            neighbor.on_neighbor_changed(self, neighbor_pos, pos);
        }
    }
}
```

### Tick Processing

`do_tick` should execute your server's tick loop:

```rust
fn do_tick(&mut self) {
    self.tick += 1;

    // Process scheduled ticks
    let scheduled = self.scheduled_ticks.drain_for_tick(self.tick);
    for (pos, block_type) in scheduled {
        if let Some(block) = self.blocks.get(&pos) {
            block.scheduled_tick(self, pos);
        }
    }

    // Process block event queue
    self.process_block_events();
}
```

## Implement FlintPlayer

The player trait manages inventory and item interactions.

```rust
use flint_core::{FlintPlayer, Item, BlockPos};
use flint_core::test_spec::{PlayerSlot, BlockFace};

pub struct MyTestPlayer {
    inventory: [Option<ItemStack>; 41],
    selected_slot: u8,
    world: *mut MyTestWorld,
}

impl FlintPlayer for MyTestPlayer {
    fn set_slot(&mut self, slot: PlayerSlot, item: Option<&Item>) {
        let index = slot_to_index(slot);
        self.inventory[index] = item.map(|i| ItemStack::from_flint(i));
    }

    fn get_slot(&self, slot: PlayerSlot) -> Option<Item> {
        let index = slot_to_index(slot);
        self.inventory[index].as_ref().map(|stack| Item {
            id: stack.item_id().to_string(),
            count: stack.count(),
        })
    }

    fn select_hotbar(&mut self, slot: u8) {
        assert!(slot >= 1 && slot <= 9, "Hotbar slot must be 1-9");
        self.selected_slot = slot;
    }

    fn selected_hotbar(&self) -> u8 {
        self.selected_slot
    }

    fn use_item_on(&mut self, pos: BlockPos, face: &BlockFace) {
        // Get held item
        let slot = PlayerSlot::hotbar(self.selected_slot).unwrap();
        let held_item = self.get_slot(slot);

        // Get target block
        let world = unsafe { &mut *self.world };
        let target_block = world.get_block(pos);

        // Execute interaction logic
        if let Some(item) = held_item {
            self.interact_item_on_block(world, pos, face, &item, &target_block);
        } else {
            self.interact_empty_hand(world, pos, face, &target_block);
        }
    }
}

fn slot_to_index(slot: PlayerSlot) -> usize {
    match slot {
        PlayerSlot::Hotbar1 => 0,
        PlayerSlot::Hotbar2 => 1,
        // ... etc.
        PlayerSlot::OffHand => 40,
    }
}
```

**Notes:**
- `use_item_on` should execute your server's actual interaction logic
- This tests that honeycomb waxes copper, axes strip logs, etc.
- The player doesn't need full entity simulation

## Running Tests

### Run Single Test

```rust
use flint_core::{TestRunner, TestSpec};
use std::path::Path;

fn run_single_test() {
    let adapter = MyServerAdapter::new();
    let runner = TestRunner::new(&adapter);

    let spec = TestSpec::from_file(&Path::new("tests/my-test.json")).unwrap();
    let result = runner.run_test(&spec);

    if result.success {
        println!("Test passed!");
    } else {
        println!("Test failed: {:?}", result.failure_reason);
    }
}
```

### Run Multiple Tests

```rust
use flint_core::TestLoader;

fn run_all_tests() {
    let adapter = MyServerAdapter::new();
    let runner = TestRunner::new(&adapter);

    let loader = TestLoader::new(Path::new("./tests"), true).unwrap();
    let test_files = loader.collect_all_test_files().unwrap();

    let specs: Vec<TestSpec> = test_files
        .iter()
        .filter_map(|f| TestSpec::from_file(f).ok())
        .collect();

    let summary = runner.run_tests(&specs);
    summary.print_concise_summary();
}
```

### Filter by Tags

```rust
let loader = TestLoader::new(Path::new("./tests"), true).unwrap();
let files = loader.collect_by_tags(&["redstone".to_string()])?;
```

## Output Formats

```rust
let summary = runner.run_tests(&specs);

// Compact output
summary.print_concise_summary();

// Verbose output
summary.print_test_summary(80);

// Machine-readable formats
summary.print_json();    // JSON
summary.print_tap();     // TAP (Test Anything Protocol)
summary.print_junit();   // JUnit XML
```

## Complete Example

```rust
use flint_core::{
    FlintAdapter, FlintWorld, FlintPlayer,
    TestRunner, TestSpec, TestLoader,
    Block, Item, ServerInfo,
    traits::BlockData,
    test_spec::{PlayerSlot, BlockFace},
};
use std::path::Path;

struct SteelAdapter;

impl FlintAdapter for SteelAdapter {
    fn create_test_world(&self) -> Box<dyn FlintWorld> {
        Box::new(SteelTestWorld::new())
    }

    fn server_info(&self) -> ServerInfo {
        ServerInfo { minecraft_version: "1.21.1".to_string() }
    }
}

fn main() {
    let adapter = SteelAdapter;
    let runner = TestRunner::new(&adapter);

    let loader = TestLoader::new(Path::new("./tests"), true)
        .expect("Failed to load tests");

    let files = loader.collect_all_test_files()
        .expect("Failed to collect test files");

    let specs: Vec<TestSpec> = files.iter()
        .filter_map(|f| {
            TestSpec::from_file(f)
                .map_err(|e| eprintln!("Parse error {}: {}", f.display(), e))
                .ok()
        })
        .collect();

    println!("Running {} tests...\n", specs.len());

    let summary = runner.run_tests(&specs);
    summary.print_concise_summary();

    std::process::exit(if summary.all_passed() { 0 } else { 1 });
}
```
