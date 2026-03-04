#!/bin/bash

# Exit on error
set -e

CLIENT_DIR="huntban-client"

echo "Checking for huntban-client directory..."
if [ -d "$CLIENT_DIR" ]; then echo "Entering $CLIENT_DIR..."; cd "$CLIENT_DIR"; else echo "Error: $CLIENT_DIR not found. Clone it first using the workflow."; exit 1; fi

echo "Installing dependencies..."
npm install

echo "Starting Tauri build..."
npm run tauri:build

echo "Build complete! Artifacts can be found in $CLIENT_DIR/src-tauri/target/release/bundle"
