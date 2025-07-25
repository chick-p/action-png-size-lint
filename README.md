# README

This GitHub Action is that check png files if the file size can be reduced.

## Inputs

### `image-paths`

The image file path as blob.
Required.

### `limit`

The allowed saving rate.
Optional. Default is `80`.

## Usage

### Example 1

Check the size of the png files in the `fixtures` directory.

```yaml
name: lint
on:
  pull_request:
    paths:
      - "fixtures/**.png"
jobs:
  png-size-lint:
    runs-on: ubuntu-latest
    name: Image compress
    steps:
      - uses: actions/checkout@v4
      - name: Check size
        uses: chick-p/action-png-size-lint@v0
        with:
          image-paths: |
            fixtures/**/*.png
          limit: 90
```

### Example 2

Check the size of png files in diff

```yaml
name: lint
on:
  pull_request:
    paths:
      - "**.png"
jobs:
  png-size-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: List changed files
        id: png-files
        run: |
          {
            echo 'CHANGED_FILES<<EOF'
            git diff "$BASE_SHA" "$HEAD_SHA" --diff-filter=AM --name-only -- "*.png"
            echo 'EOF'
          } >> "$GITHUB_OUTPUT"
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}

      - uses: chick-p/action-png-size-lint@v0
        with:
          image-paths: ${{ steps.png-files.outputs.CHANGED_FILES }}
          limit: 90
```
