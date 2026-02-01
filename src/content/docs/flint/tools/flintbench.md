---
title: FlintBench
description: The official test collection for validating Minecraft server behavior
sidebar:
  order: 3
---

FlintBench is the official repository containing all Flint tests for validating Minecraft server behavior against vanilla. Tests created by the community should be contributed here.

## Purpose

FlintBench provides:

- **Vanilla behavior validation** - Tests verify servers match vanilla Minecraft
- **Compliance tracking** - Compare implementations against Paper, Purpur, Spigot, Fabric
- **Community-driven tests** - Anyone can contribute new tests
- **Organized test suite** - Tests categorized by game mechanic

## Repository

```bash
git clone https://github.com/FlintTestMC/FlintBenchmark
```

## Test Organization

Tests are organized by mechanic type:

```
tests/
├── connectible/          # Blocks that connect to neighbors
│   ├── fence.json        # Fence connections (12 wood types)
│   ├── wall.json         # Wall connections
│   ├── iron.json         # Iron bar connections
│   └── fences/           # Advanced fence tests
│       ├── fence_row_connections.json
│       └── use_item_on.json
│
└── fluids/               # Water and lava mechanics
    ├── mixing.json       # Lava + water = obsidian/cobblestone
    └── water/            # Water-specific tests
        ├── horizontal_spread.json
        ├── infinite_source.json
        ├── shortest_path.json
        └── ...
```

## Running FlintBench Tests

Use FlintCLI to run the test suite:

```bash
# Run all tests
flintmc FlintBenchmark/tests/ -s localhost:25565 -r

# Run only fluid tests
flintmc FlintBenchmark/tests/fluids/ -s localhost:25565 -r

# Run tests by tag
flintmc FlintBenchmark/tests/ -s localhost:25565 -r -t water
```

## Contributing Tests

When you create tests using [FlintCLI recording](./recording/), contribute them to FlintBench:

1. Fork the FlintBenchmark repository
2. Add your test to the appropriate category folder
3. Format your test: `npm run format`
4. Submit a pull request

### Test Requirements

- Tests must validate vanilla Minecraft behavior
- Use descriptive names and tags
- Include a clear description
- Place in the correct category folder

### Formatting

FlintBench uses FracturedJson for consistent formatting:

```bash
npm install
npm run format        # Format all tests
npm run format:check  # Verify formatting (used in CI)
```

## Current Test Coverage

| Category | Tests | Description |
|----------|-------|-------------|
| Connectible | 7 | Fences, walls, iron bars |
| Fluids | 20 | Water spread, sources, mixing |

See `TODO.md` in the repository for blocks still needing tests.

## Next Steps

- [FlintCLI](../flintcli/) - Run tests from FlintBench
- [Recording Tests](../recording/) - Create new tests to contribute
