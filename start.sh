#!/bin/bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] STARTED: start.sh script" >> /home/ec2-user/cron.log 2>&1
/home/ec2-user/.bun/bin/bun /home/ec2-user/projects/fractal-cron-job/nodemailer.ts >> /home/ec2-user/cron.log 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] COMPLETED: start.sh script" >> /home/ec2-user/cron.log 2>&1