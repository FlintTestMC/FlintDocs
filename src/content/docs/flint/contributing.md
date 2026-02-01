---
title: Contributing to Flint
description: How to contribute to the Flint project
sidebar:
  order: 11
---

This guide explains how to contribute to Flint Core.

## Getting Started

### Prerequisites

- Rust (Edition 2024)
- Git

### Clone Repository

```bash
git clone https://github.com/FlintTestMC/flint-core.git
cd flint-core
cargo build
```

### Run Tests

```bash
cargo test
```

Some tests must run serially:

```bash
cargo test -- --test-threads=1
```

## Project Structure

```
flint-core/
├── src/
│   ├── lib.rs           # Public API and re-exports
│   ├── test_spec.rs     # Test schema (JSON DSL)
│   ├── traits.rs        # Core traits
│   ├── runner.rs        # Test execution engine
│   ├── loader.rs        # Test file discovery
│   ├── index.rs         # Tag-based indexing
│   ├── results.rs       # Test result types
│   ├── timeline.rs      # Timeline aggregation
│   ├── format.rs        # Output formatting
│   ├── spatial.rs       # Spatial utilities
│   └── utils.rs         # Helper functions
├── Cargo.toml
└── README.md
```

## Module Overview

### test_spec.rs

Defines the JSON test format:
- `TestSpec` - Complete test definition
- `Block` - Block state with properties
- `ActionType` - All actions (place, assert, useItemOn, etc.)
- `PlayerSlot`, `BlockFace` - Enums for player/block interactions

### traits.rs

Core traits that servers implement:
- `FlintAdapter` - Creates test worlds
- `FlintWorld` - Block operations and tick execution
- `FlintPlayer` - Inventory and item interactions

Helper types:
- `Item` - Stackable inventory item
- `BlockData` - Block state from world
- `BlockPos` - Position type alias

### runner.rs

The `TestRunner` executes tests:
- Loads test specifications
- Creates world via adapter
- Executes timeline actions tick by tick
- Collects assertion results

### results.rs

Result types:
- `TestResult` - Single test result
- `TestSummary` - Aggregated results
- `AssertFailure` - Detailed failure information

### format.rs

Output formatters:
- Compact human-readable output
- Verbose mode
- JSON, TAP, JUnit XML

## Code Style

### Formatting

```bash
cargo fmt
```

### Linting

```bash
cargo clippy
```

All warnings should be fixed.

### Documentation

- Doc comments for public items
- Examples in doc comments where helpful
- Keep comments concise and accurate

## Adding New Features

### New Action Type

1. Add variant to `ActionType` in `test_spec.rs`:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "do", rename_all = "snake_case")]
pub enum ActionType {
    // Existing actions...

    /// Description of new action
    NewAction {
        pos: [i32; 3],
        some_field: String,
    },
}
```

2. Add handler in `runner.rs`:

```rust
fn execute_action(&self, world: &mut dyn FlintWorld, ...) -> ActionOutcome {
    match action {
        // Existing handlers...

        ActionType::NewAction { pos, some_field } => {
            // Implementation
            ActionOutcome::Action
        }
    }
}
```

3. Add validation in `TestSpec::validate()` if needed
4. Write tests
5. Update documentation

### New Output Format

Add new formatter in `format.rs`:

```rust
pub fn print_my_format(results: &[TestResult], elapsed: Duration) {
    // Format implementation
}
```

Add method to `TestSummary` in `results.rs`:

```rust
pub fn print_my_format(&self) {
    format::print_my_format(&self.results, self.elapsed());
}
```

## Testing

### Unit Tests

Each module has a test submodule:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_feature() {
        // Arrange
        let input = ...;

        // Act
        let result = function(input);

        // Assert
        assert_eq!(result, expected);
    }
}
```

### Serial Tests

Tests that modify environment variables:

```rust
use serial_test::serial;

#[test]
#[serial]
fn test_with_env_vars() {
    std::env::set_var("INDEX_NAME", "test.json");
    // Test logic
}
```

### Temp Directories

```rust
use tempfile::TempDir;

#[test]
fn test_file_operations() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("test.json");
    // Create files, run tests, cleanup is automatic
}
```

## Pull Request Process

1. **Fork** the repository
2. **Create branch**: `git checkout -b feat/my-feature`
3. **Make changes** with clear, focused commits
4. **Run tests**: `cargo test`
5. **Run lints**: `cargo clippy && cargo fmt --check`
6. **Push** to your fork
7. **Open PR** with clear description

### Commit Messages

Follow conventional commits:

```
feat: add new action type for block breaking
fix: correct power level calculation in assertions
docs: update integration guide
test: add tests for multi-tick actions
refactor: simplify timeline aggregation
```

### PR Description

```markdown
## Summary
Brief description of changes

## Changes
- Added X
- Fixed Y
- Updated Z

## Testing
How were these changes tested?

## Breaking Changes
List breaking changes (if applicable)
```

## Getting Help

- Open an issue for bugs or feature requests
- Join Discord for discussions
- Tag maintainers for PR reviews

## License

Flint Core is MIT licensed. By contributing, you agree to license your contributions under the same terms.
