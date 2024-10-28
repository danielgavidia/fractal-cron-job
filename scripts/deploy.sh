#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Check if variables are set
if [[ -z "$EC2_USER" || -z "$EC2_HOST" || -z "$KEY_PATH" || -z "$LOCAL_DIRECTORY" || -z "$DESTINATION_DIRECTORY" ]]; then
  echo "One or more environment variables are missing. Please check the .env file."
  exit 1
fi

# Perform the rsync command, excluding the node_modules folder
rsync -avz --exclude 'node_modules' -e "ssh -i $KEY_PATH" "$LOCAL_DIRECTORY/" "$EC2_USER@$EC2_HOST:$DESTINATION_DIRECTORY"

# Confirm completion
if [[ $? -eq 0 ]]; then
  echo "Directory copied successfully to $EC2_USER@$EC2_HOST:$DESTINATION_DIRECTORY"
  
  # Execute chmod command remotely via SSH
  ssh -i "$KEY_PATH" "$EC2_USER@$EC2_HOST" "chmod +x $DESTINATION_DIRECTORY/start.sh"
  
  if [[ $? -eq 0 ]]; then
    echo "Permissions updated successfully for start.sh"
  else
    echo "Error updating permissions for start.sh"
  fi
else
  echo "Error copying directory."
fi
