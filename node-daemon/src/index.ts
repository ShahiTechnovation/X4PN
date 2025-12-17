import { WireGuardService } from "./wireguard";
import os from "os";

const WG_INTERFACE = process.env.WG_INTERFACE || "wg0";
const WG_PORT = parseInt(process.env.WG_PORT || "51820");
const WG_IP = process.env.WG_IP || "10.8.0.1/24";

async function main() {
    console.log("🚀 Starting X4PN Node Daemon...");
    console.log(`OS: ${os.platform()} ${os.release()}`);

    try {
        // 1. Initialize Keys
        // In production, these should be persisted to disk/env
        let keys;
        try {
            keys = await WireGuardService.generateKeys();
            console.log("🔑 Generated new Node Identity");
            console.log(`   Public Key: ${keys.publicKey}`);
        } catch (e) {
            console.warn("⚠️  Could not generate WireGuard keys (WireGuard not installed?)");
            console.warn("   Running in SIMULATION MODE");
            return runSimulation();
        }

        // 2. Start WireGuard Service
        const wg = new WireGuardService({
            interfaceName: WG_INTERFACE,
            port: WG_PORT,
            privateKey: keys.privateKey,
            address: WG_IP
        });

        try {
            await wg.up();
        } catch (e) {
            console.error("❌ Failed to initialize network interface. Are you root?");
            console.error(e);
            process.exit(1);
        }

        // 3. Connect to Platform (Placeholder)
        console.log("📡 Connecting to Platform API...");

        // 4. Teardown on exit
        const stop = async () => {
            console.log("\nStopping Node...");
            await wg.down();
            process.exit(0);
        };
        process.on("SIGINT", stop);
        process.on("SIGTERM", stop);

        // Keep alive
        setInterval(async () => {
            try {
                const stats = await wg.getStats();
                console.log(`[Heartbeat] Active Peers: ${stats.length}`);
            } catch (e) {
                // Ignore errors in loop
            }
        }, 10000);

    } catch (error) {
        console.error("Fatal Error:", error);
        process.exit(1);
    }
}

function runSimulation() {
    console.log("------------ SIMULATION MODE ------------");
    console.log("Real WireGuard interfaces require Linux kernel modules.");
    console.log("Simulating Daemon behavior for development...");

    setInterval(() => {
        console.log("[Sim] Heartbeat sent. Active Peers: 0");
    }, 5000);
}

main().catch(console.error);
