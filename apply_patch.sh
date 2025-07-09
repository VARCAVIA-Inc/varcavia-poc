#!/usr/bin/env bash
set -euo pipefail
curl -fsSL "$1" | git apply -
