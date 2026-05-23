---
title: Recording Tests
description: Create Flint tests by recording your actions in-game
sidebar:
  order: 2
---

FlintCLI includes a recording mode that captures your in-game actions and generates test files automatically. This is the fastest way to create tests without writing JSON manually.

## Starting a Recording

1. Start FlintCLI in interactive mode:

```bash
flintmc -s localhost:25565 -i
```

2. In-game, type the record command:

```
!record my_test_name
```

3. The bot will announce that recording has started and freeze game time.

## Recording Workflow

Once recording starts:

1. **Place blocks** - All block changes are captured with their tick timing
2. **Advance ticks** - Use `!tick` or `!next` to snapshot changes and step forward
3. **Add assertions** - Use `!assert <x> <y> <z>` to capture the current block at a world position
4. **Save the test** - Use `!save` when done

## Recording Commands

| Command | Description |
|---------|-------------|
| `!record <name> [player]` | Start recording; optional player controls scan center |
| `!tick` / `!next` | Snapshot changes, step one game tick, and advance recording time |
| `!assert <x> <y> <z>` | Assert the block currently at the given world coordinates |
| `!assert_changes` | Convert detected changes in the current recording tick into assertions |
| `!sprint <ticks>` | Repeat tick/assert using the last asserted position |
| `!save` | Save and finish recording |
| `!cancel` | Discard recording |

## Example Recording Session

```
Player: !record fence_test
Bot: Recording started for 'fence_test'. Game time frozen.

[Player places an oak fence at 0, 100, 0]

Player: !tick
Bot: Tick 1

[Player places a stone block next to the fence at 1, 100, 0]

Player: !tick
Bot: Tick 2

Player: !assert 0 100 0
Bot: Added assert at [0, 100, 0] = minecraft:oak_fence[east=true]

Player: !save
Bot: Test saved to fence_test.json
```

## Generated Test Structure

Recording generates a complete test file:

```json
{
  "name": "fence_test",
  "tags": ["recorded"],
  "setup": {
    "cleanup": {
      "region": [[-5, 95, -5], [5, 105, 5]]
    }
  },
  "timeline": [
    {
      "at": 0,
      "do": "place",
      "pos": [0, 100, 0],
      "block": { "id": "minecraft:oak_fence" }
    },
    {
      "at": 1,
      "do": "place",
      "pos": [1, 100, 0],
      "block": { "id": "minecraft:stone" }
    },
    {
      "at": 2,
      "do": "assert",
      "checks": [
        { "pos": [0, 100, 0], "is": { "id": "minecraft:oak_fence", "east": "true" } },
        { "pos": [1, 100, 0], "is": { "id": "minecraft:stone" } }
      ]
    }
  ]
}
```

## Tips

### Cleanup Region

The recording automatically calculates a cleanup region that encompasses all placed blocks with padding. You can edit this in the generated JSON if needed.

### Tick Timing

- Use `!tick` frequently to capture precise timing
- Redstone mechanics often need multiple ticks to propagate
- Water and lava flow requires many ticks (check timing in generated tests)

### Assertions

- `!assert <x> <y> <z>` captures the block at one position
- `!assert_changes` changes all placements/removals detected in the current tick into assertions
- `!sprint <ticks>` is useful for repeated timing checks after setting an initial assertion position
- You can add multiple assertions at different tick points

### Editing Generated Tests

Recording creates a good starting point, but you may want to:

- Add tags for organization
- Add a description
- Adjust the cleanup region
- Add breakpoints for debugging

## Contributing to FlintBench

Tests that validate vanilla Minecraft behavior should be contributed to [FlintBench](./flintbench/), the official test collection. After recording a test:

1. Fork the FlintBenchmark repository
2. Place your test in the appropriate category folder
3. Run `npm run format` to format the JSON
4. Submit a pull request

## Next Steps

- [FlintBench](./flintbench/) - Contribute your tests to the official collection
- [FlintCLI Reference](./flintcli/) - Complete command reference
- [Test Format](../../testformat/overview/) - Understand the generated JSON format
