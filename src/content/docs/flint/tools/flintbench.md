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

Each suite keeps Flint JSON files under its own `tests/` directory.

## Test Organization

Tests are organized by mechanic type:

```
tests/
├── connectible/          # Blocks that connect to neighbors
│   ├── fences/           # Fence placement and row connections
│   ├── walls/            # Wall connections and mixed neighbors
│   ├── iron.json         # Iron bar connections
│   └── bars/             # Copper and iron bar behavior in the bars suite
│
├── fluids/               # Water and lava mechanics
│   ├── mixing.json       # Lava + water = obsidian/cobblestone
│   └── water/            # Water spread, sources, falling state, stability
│
├── portal/nether/        # Nether portal creation and destruction
└── blocks/decoration/    # Suite-specific blocks like chain and panes
```

## Running FlintBench Tests

Use FlintCLI to run the test suite:

```bash
# Run all tests
flintmc FlintBenchmark/main/tests/ -s localhost:25565 -r

# Run only fluid tests
flintmc FlintBenchmark/main/tests/fluids/ -s localhost:25565 -r

# Run tests by tag
flintmc FlintBenchmark/main/tests/ -s localhost:25565 -r -t water
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

| Category | Coverage |
|----------|----------|
| Connectible | Fences, walls, bars, panes, chains, iron bars |
| Fluids | Water spread, sources, falling state, replacement, mixing |
| Portals | Nether portal creation and destruction |
| Decoration blocks | Chain, panes, bars, and suite-specific block variants |

See `TODO.md` in the repository for blocks still needing tests.

## Next Steps

- [FlintCLI](./flintcli/) - Run tests from FlintBench
- [Recording Tests](./recording/) - Create new tests to contribute
