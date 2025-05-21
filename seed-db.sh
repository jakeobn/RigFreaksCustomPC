#!/bin/bash

# Seed Database Utility
# This script provides a convenient way to run database seed operations
# without causing component duplication

echo "RigFreaks Database Seeding Utility"
echo "---------------------------------"
echo "This tool helps manage database seeding without component duplication."
echo

# Check if tsx is available
if ! command -v tsx &> /dev/null
then
    echo "Error: tsx is not installed. Please run 'npm install -g tsx' first."
    exit 1
fi

# Display options
echo "Available options:"
echo "  1. View current component counts"
echo "  2. Run all seeding operations"
echo "  3. Run base database seed only"
echo "  4. Run accessory collections seed only"  
echo "  5. Run CPU coolers seed only"
echo "  0. Exit"
echo

# Get user choice
read -p "Enter your choice (0-5): " choice

case $choice in
    1)
        echo "Checking component counts..."
        tsx server/scripts/run-seeds.ts
        ;;
    2)
        echo "Running all seeding operations..."
        tsx server/scripts/run-seeds.ts --all
        ;;
    3)
        echo "Running base database seed..."
        tsx server/scripts/run-seeds.ts --base
        ;;
    4)
        echo "Running accessory collections seed..."
        tsx server/scripts/run-seeds.ts --collections
        ;;
    5)
        echo "Running CPU coolers seed..."
        tsx server/scripts/run-seeds.ts --coolers
        ;;
    0)
        echo "Exiting."
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo
echo "Operation completed."