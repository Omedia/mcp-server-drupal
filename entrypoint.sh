#!/bin/sh

DENO_ARGS="--allow-net --allow-read --allow-env"
APP_ARGS=""

# Process all arguments
for arg in "$@"; do
  if [ "$arg" = "--unsafe-net" ]; then
    DENO_ARGS="$DENO_ARGS --unsafely-ignore-certificate-errors"
  else
    APP_ARGS="$APP_ARGS $arg"
  fi
done

# Execute Deno with processed arguments
exec deno run $DENO_ARGS src/mod.ts $APP_ARGS
