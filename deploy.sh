#!/bin/bash

# NOTES:
# Copy this file and rename to something like deploy-prod.sh
# Change file permission to allow execution example: `chmod u+x deploy-prod.sh`

sshuser='CHANGE_WITH_USER'
sshhost='CHANGE_WITH_HOST'
sshpath='/var/www/html'

# Show what will be deployed and ask for confirmation
rsync -auvrzn --exclude='node_modules' --exclude='data' --exclude='deploy*' --exclude='public/dist' --exclude=".git" --exclude=".gitignore" . "$sshuser@$sshhost:$sshpath"

read -p "The above files will be deployed. Continue? [y/n] " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	[[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi

# Copy everything needed
rsync -auvrz --exclude='node_modules' --exclude='data' --exclude='deploy*' --exclude='public/dist' --exclude=".git" --exclude=".gitignore" . "$sshuser@$sshhost:$sshpath"

# Build app & start
ssh "$sshuser@$sshhost" "cd $sshpath && npm install && npm i -g pm2 && npm run build && pm2 start ecosystem.config.js"
