#!/bin/sh
echo "Hello, World!"

# Update
sudo yum update -y

# Cron
sudo yum install -y cronie # install crontab
sudo service crond start # start the cron service
sudo chkconfig crond on # enable cron to start on boot
sudo service crond status # verify that cron is running

# Node
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - # install
sudo yum install -y nodejs # install
node -v # check version
npm -v # check version

# Bun
curl -fsSL https://bun.sh/install | bash # install
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc # add bun to your path
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc # add bun to your path
source ~/.bashrc # add bun to your path
bun -v # verify the installation

