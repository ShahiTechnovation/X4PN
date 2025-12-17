import { io, Socket } from "socket.io-client";

export class PlatformClient {
    private socket: Socket;
    private nodeId: string;
    private operatorAddress: string;
    private onSessionStartCallback?: (data: any) => Promise<void>;

    constructor(
        platformUrl: string,
        nodeId: string,
        operatorAddress: string,
        onSessionStart?: (data: any) => Promise<void>
    ) {
        this.nodeId = nodeId;
        this.operatorAddress = operatorAddress;
        this.onSessionStartCallback = onSessionStart;

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

    private async handleSessionStart(data: any) {
        console.log(`[Platform] 📩 Received session request for user: ${data.userAddress}`);

        if (this.onSessionStartCallback) {
            try {
                await this.onSessionStartCallback(data);
                // Confirm success back to platform (optional)
                this.socket.emit("session:confirmed", { sessionId: data.sessionId });
            } catch (error: any) {
                console.error(`[Platform] Failed to handle session: ${error.message}`);
                this.socket.emit("session:failed", { sessionId: data.sessionId, error: error.message });
            }
        }
    }
}
