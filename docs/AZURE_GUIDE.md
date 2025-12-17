# Deploying X4PN Node on Azure

## 1. Create the Virtual Machine
1. Log in to [Azure Portal](https://portal.azure.com).
2. Click **"Create a resource"** > **"Virtual Machine"**.
3. **Basics**:
   - **Image**: Ubuntu Server 22.04 LTS (x64 Gen2).
   - **Size**: Standard_B1s (1 vCPU, 1GB RAM) is enough for testing. For production, use **Standard_B2s**.
   - **Authentication**: SSH Public Key (Generate a new key pair).
4. **Networking**:
   - **Public IP**: Create new (Standard).
   - **NIC Network Security Group**: Advanced (Create new).
   - **Inbound Ports**: Allow SSH (22), HTTP (80), HTTPS (443).
   - **IMPORTANT**: Click "Add inbound rule" for WireGuard:
     - **Service**: Custom
     - **Protocol**: **UDP**
     - **Port**: **51820**
     - **Action**: Allow
     - **Priority**: 1010
     - **Name**: AllowWireGuard

## 2. Connect to the VM
Open your local terminal (WSL or PowerShell) and connect:
```bash
ssh -i <path_to_key.pem> azureuser@<VM_PUBLIC_IP>
```

## 3. Install & Deploy
Once connected to the Azure VM, run these commands to clone and set up the node:

```bash
# 1. Clone the repository
git clone https://github.com/ShahiTechnovation/X4PN-VPN.git
cd X4PN-VPN

# 2. Run the Auto-Setup Script
# This will install Docker, WireGuard, and start the Node
chmod +x setup_vps.sh
sudo ./setup_vps.sh
```

## 4. Register Your Azure Node
1. The script will output your **Operator Address** and **Public Key**.
2. Go to your local X4PN Dashboard (http://localhost:5000/nodes).
3. Connect your wallet.
4. Click **"Register Node"**.
   - **IP Address**: Enter your Azure VM's Public IP.
   - **Port**: 51820
   - **Name**: "Azure Node 1"
   - **Country**: "US" (or your Azure region).

## 5. Verify Connection
1. Go to "Dashboard" in the UI.
2. Connect to "Azure Node 1".
3. Click "Download WireGuard Config".
4. Import into WireGuard client and activate!
