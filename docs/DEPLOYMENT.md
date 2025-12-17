# Production Deployment Guide (Linux VPS)

This guide explains how to deploy the **X4PN VPN Platform** and **VPN Nodes** on a Linux Virtual Private Server (VPS). 
Supported OS: Ubuntu 20.04 LTS / 22.04 LTS (recommended).

## Prerequisites

- A Linux VPS (e.g., DigitalOcean Droplet, AWS EC2, Vultr)
- Root (sudo) access
- A valid domain name pointing to your VPS IP (for Full Stack deployment)

## Fast Track: One-Click Installer

We provide an automated script to handle installation, dependencies (Docker, WireGuard modules), and configuration.

1. **Upload the code to your VPS** (via Git or SCP).
2. **Run the installer**:
   ```bash
   chmod +x setup_vps.sh
   sudo ./setup_vps.sh
   ```
3. **Follow the prompts**:
   - Select **Option 1 (Full Stack)** to run the Dashboard + API + Database + Initial Node.
   - Select **Option 2 (Node Only)** to run just a VPN Gateway (connects to an existing Platform).

---

## Manual Deployment

If you prefer to configure everything manually, follow these steps.

### 1. Install Dependencies

You must install Docker and the WireGuard kernel modules on the host system.

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install WireGuard Modules
sudo apt install -y wireguard wireguard-tools

# Enable IP Forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.d/99-x4pn.conf
sudo sysctl -p /etc/sysctl.d/99-x4pn.conf

# Install Docker
curl -fsSL https://get.docker.com | sh
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
nano .env
```

Set your production values (Database URL, Secrets, etc.).

### 3. Deploy Full Stack (Dashboard + Node)

This runs the Web Platform, Postgres Database, Nginx Reverse Proxy, and (optionally) a Node.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

The platform will be available at `http://YOUR_IP` (or domain if configured in nginx).

### 4. Deploy Dedicated VPN Node

If you are setting up a distributed node (a server just for VPN traffic):

1. Edit `.env` or set variables directly:
   ```bash
   export PLATFORM_URL="https://your-platform-domain.com"
   export NODE_ID="sg-node-01"
   export NODE_PRIVATE_KEY="<your_private_key>"
   ```

2. Run the Node container:
   ```bash
   docker compose -f docker-compose.node.yml up -d --build
   ```

## Verification

Check that the containers are running:
```bash
docker ps
```

Check logs for the VPN Node:
```bash
docker logs -f x4pn-node
```

You should see:
> [WireGuard] Interface wg0 is UP.
> [Platform] ✅ Authenticated successfully.

## Troubleshooting

**"Failed to initialize network interface"**:
- Ensure you ran `apt install wireguard` on the host.
- Ensure you rebooted if kernel modules were just installed.
- Check `dmesg | grep wireguard` to see if the module is loaded.

**"Connection Refused" (Platform)**:
- Ensure the `PLATFORM_URL` is correct and reachable from the Node server.
- Check firewall settings (allow 5000/tcp, 80/tcp, 443/tcp, and 51820/udp).
