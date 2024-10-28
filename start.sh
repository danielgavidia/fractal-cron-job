#!/bin/bash
source /home/ec2-user/projects/fractal-cron-job/.env
# Add some debugging
echo "Checking environment variables:"
echo "EMAIL_USER: ${EMAIL_USER:-not set}"
echo "ENV_PATH: ${ENV_PATH:-not set}"
EMAIL_USER="$EMAIL_USER"
EMAIL_PASSWORD="$EMAIL_PASSWORD"
ENV_PATH="$ENV_PATH"
/home/ec2-user/.bun/bin/bun /home/ec2-user/projects/fractal-cron-job/nodemailer.ts >> /home/ec2-user/cron.log 2>&1