#!/bin/bash

# X4PN Node Setup Script for Ubuntu 22.04 LTS
set -e

echo "🚀 Starting X4PN Node Setup..."

# 1. Install Docker & Dependencies
if ! command -v docker &> /dev/null; then
    echo "Allocating Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 2. Enable IP Forwarding (Required for WireGuard routing)
echo "Configuring Kernel..."
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.d/99-x4pn.conf
sudo sysctl -p /etc/sysctl.d/99-x4pn.conf

# 3. Pull and Run Daemon
echo "Deploying Node Daemon..."
# In a real scenario, this would pull from a registry
# docker pull ghcr.io/shahitechnovation/x4pn-daemon:latest

# For now, we assume the code is present or we build it
echo "Building local image (Placeholder)..."
# docker build -t x4pn-daemon ./node-daemon

echo "Starting Container..."
# Generates a random port for WireGuard
WG_PORT=51820

docker run -d \
  --name x4pn_node \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  -v /lib/modules:/lib/modules \
  -e WG_PORT=$WG_PORT \
  -e PLATFORM_URL="https://api.x4pn.com" \
  -p $WG_PORT:$WG_PORT/udp \
  --restart always \
  x4pn-daemon

echo "✅ Node Setup Complete!"
echo "WireGuard Running on Port: $WG_PORT"
echo "Please register your Operator Address in the Dashboard."
