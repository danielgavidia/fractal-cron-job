#!/bin/sh
echo "Hello, World!"

# Update
sudo yum update -y

# Cron
sudo yum install -y cronie # install crontab
sudo service crond start # start the cron service
sudo chkconfig crond on # enable cron to start on boot
sudo service crond status # verify that cron is running