#!/bin/bash

# Variables
REMOTE_USER="giff"
REMOTE_HOST="51.222.86.74"
REMOTE_DIR="/var/www/casabambuwestbay.com/"

# Directories to remove and copy
DIRS=("build" "dist" ".next", 'ecosystem.config.js')

# Step 1: Remove existing directories on the remote server
echo "Removing old directories on the remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -rf ${REMOTE_DIR}/${DIRS[0]} ${REMOTE_DIR}/${DIRS[1]} ${REMOTE_DIR}/${DIRS[2]}"

# Step 2: Copy new directories to the remote server
echo "Copying new directories to the remote server..."
scp -r ${DIRS[@]} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

echo "Deployment completed successfully!"
