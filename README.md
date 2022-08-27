# README

This GitHub Action is that check png files if the file size can be reduced.

## Inputs

### `image-paths`

The image file path as blob.
Required.

### `limit`

The allowed saving rate.
Optional. Default is `80`.

## Example usage

.github/workflows/lint.yml

```yaml
name: lint
on:
  pull_request:
    paths:
      - "fixtures/**.png"
jobs:
  lint:
    runs-on: ubuntu-latest
    name: Image compress
    steps:
      - uses: actions/checkout@v3
      - name: Check size
        uses: chick-p/action-png-size-lint@v0
        with:
          image-paths: |
            fixtures/**/*.png
          limit: 90
```
