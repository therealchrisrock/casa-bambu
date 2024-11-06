#!/bin/bash

# Variables
REMOTE_USER="giff"
REMOTE_HOST="51.222.86.74"
REMOTE_DIR="/var/www/casabambuwestbay.com/"

# Directories to remove and copy
DIRS=("build" "dist" ".next" "ecosystem.config.js")


# Step 1: Remove existing directories on the remote server
echo "Removing old directories on the remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -rf ${REMOTE_DIR}/${DIRS[0]} ${REMOTE_DIR}/${DIRS[1]} ${REMOTE_DIR}/${DIRS[2]}"

# Step 2: Copy new directories to the remote server
echo "Copying new directories to the remote server..."
scp -r ${DIRS[@]} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

echo "Deployment completed successfully!"



#
##!/bin/bash
#
## Variables
#REMOTE_USER="giff"
#REMOTE_HOST="51.222.86.74"
#REMOTE_DIR="/var/www/casabambuwestbay.com/"
#TARBALL="site_files.tar.gz"
#
## Directories to remove and copy
#DIRS=("build" "dist" ".next" "ecosystem.config.js")
#
## Step 1: Create a tarball with gzip compression
#echo "Creating tarball with gzip compression..."
#tar -czf $TARBALL ${DIRS[@]}
#
## Step 2: Remove existing directories on the remote server
#echo "Removing old directories on the remote server..."
#ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -rf ${REMOTE_DIR}/${DIRS[0]} ${REMOTE_DIR}/${DIRS[1]} ${REMOTE_DIR}/${DIRS[2]} ${REMOTE_DIR}/${DIRS[3]}"
#
## Step 3: Transfer the tarball to the remote server
#echo "Transferring tarball to the remote server..."
#scp $TARBALL ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
#
## Step 4: Extract files on the remote server and clean up
#echo "Extracting files on the remote server..."
#ssh ${REMOTE_USER}@${REMOTE_HOST} "tar -xzf ${REMOTE_DIR}/${TARBALL} -C ${REMOTE_DIR} && rm ${REMOTE_DIR}/${TARBALL}"
#
## Step 5: Run yarn deploy on the remote server
#echo "Running deployment..."
#ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_DIR} && yarn deploy"
#
## Clean up local tarball
#rm $TARBALL
#
#echo "Deployment completed successfully!"