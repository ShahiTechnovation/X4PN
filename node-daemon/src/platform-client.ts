import { io, Socket } from "socket.io-client";

export class PlatformClient {
    private socket: Socket;
    private nodeId: string;
    private operatorAddress: string;

    constructor(platformUrl: string, nodeId: string, operatorAddress: string) {
        this.nodeId = nodeId;
        this.operatorAddress = operatorAddress;

        console.log(`[Platform] Initializing connection to ${platformUrl}`);

        this.socket = io(platformUrl, {
            path: "/api/socket",
            reconnectionDelay: 1000,
            reconnection: true,
        });

        this.setupListeners();
    }

    private setupListeners() {
        this.socket.on("connect", () => {
            console.log(`[Platform] Connected with ID: ${this.socket.id}`);
            this.identify();
        });

        this.socket.on("connect_error", (err) => {
            console.warn(`[Platform] Connection Error: ${err.message}`);
        });

        this.socket.on("node:ready", (data) => {
            console.log(`[Platform] ✅ Authenticated successfully. Status: ${data.status}`);
        });

        this.socket.on("error", (err) => {
            console.error(`[Platform] ❌ Server Error: ${err.message}`);
        });

        // Use this to listen for incoming session requests
        this.socket.on("session:start", this.handleSessionStart.bind(this));
    }

    private identify() {
        console.log("[Platform] Sending identity...");
        this.socket.emit("node:identify", {
            nodeId: this.nodeId,
            operatorAddress: this.operatorAddress
        });
    }

    private handleSessionStart(data: any) {
        console.log(`[Platform] 📩 Received session request for user: ${data.userAddress}`);
        // TODO: Trigger WireGuard peer addition here
    }
}
