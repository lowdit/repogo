#!/usr/bin/env bash
# Build Hugo site for GitHub Pages — auto exampleSite vs racine.
set -euo pipefail

ROOT="${HUGO_ROOT:-$(pwd)}"
cd "$ROOT"

resolve_site_dir() {
  if [ -n "${HUGO_SITE_DIR:-}" ]; then
    echo "$HUGO_SITE_DIR"
    return
  fi
  if [ -f .github/hugo-site-dir ]; then
    tr -d ' \n\r' < .github/hugo-site-dir
    return
  fi
  if [ -f hugo.toml ] || [ -f config.toml ] || [ -f config/_default/hugo.toml ]; then
    echo "."
    return
  fi
  if [ -f exampleSite/hugo.toml ] || [ -f exampleSite/config.toml ]; then
    echo "exampleSite"
    return
  fi
  echo "ERROR: No Hugo config at repo root or exampleSite/" >&2
  exit 1
}

SITE_DIR="$(resolve_site_dir)"
BASE_URL="${1:-}"

if [ -z "$BASE_URL" ]; then
  echo "Usage: hugo-pages-build.sh <baseURL>" >&2
  exit 1
fi

echo "→ Hugo site directory: $SITE_DIR"

if [ -f "$SITE_DIR/go.mod" ]; then
  (cd "$SITE_DIR" && hugo mod get ./...)
fi

if [ -f "$SITE_DIR/../scripts/build-with-pagefind.sh" ] && [ "${HUGO_SKIP_PAGEFIND:-}" != "1" ]; then
  if grep -qE 'search\s*=\s*"pagefind"' "$SITE_DIR/hugo.toml" 2>/dev/null || \
     grep -qE 'search\s*=\s*"pagefind"' "$SITE_DIR/config.toml" 2>/dev/null; then
    THEME_SCRIPTS="$(cd "$SITE_DIR/.." && pwd)/scripts"
    if [ -f "$THEME_SCRIPTS/build-with-pagefind.sh" ]; then
      HUGO_BASEURL="$BASE_URL" "$THEME_SCRIPTS/build-with-pagefind.sh" "$SITE_DIR"
      echo "OK: $SITE_DIR/public"
      exit 0
    fi
  fi
fi

hugo -s "$SITE_DIR" --minify --environment production --baseURL "$BASE_URL"
echo "OK: $SITE_DIR/public"
