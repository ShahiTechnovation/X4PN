import { Server, Socket } from "socket.io";
import { type Server as HttpServer } from "http";
import { storage } from "./storage";

interface NodeAuth {
    operatorAddress: string;
    nodeId: string;
}

export function setupSocketServer(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        path: "/api/socket",
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // 1. Node Identity Handshake
        socket.on("node:identify", async (auth: NodeAuth) => {
            try {
                const node = await storage.getNode(auth.nodeId);

                if (!node) {
                    console.warn(`[Socket] Unknown node attempted connection: ${auth.nodeId}`);
                    socket.emit("error", { message: "Node not found. Please register first." });
                    return;
                }

                // Verify operator address matches
                if (node.operatorAddress.toLowerCase() !== auth.operatorAddress.toLowerCase()) {
                    console.warn(`[Socket] Unauthorized node connection attempt`);
                    socket.emit("error", { message: "Unauthorized operator" });
                    return;
                }

                console.log(`[Socket] Node verified: ${node.name} (${node.id})`);

                // Join a dedicated room for this node
                socket.join(`node:${node.id}`);

                // Update status to online (implementation detail for later)
                socket.emit("node:ready", { status: "active" });

            } catch (err) {
                console.error("Error identifying node:", err);
            }
        });

        // 2. Node Heartbeat (Load & Status)
        socket.on("node:heartbeat", async (data: { nodeId: string; load: number; activePeers: number }) => {
            // In a real database, we would update the 'last_seen' timestamp here
            // await storage.updateNodeHeartbeat(data.nodeId, ...);
            // For now, simpler logging
            // console.log(`[Heartbeat] Node ${data.nodeId} - Load: ${data.load}%`);
        });

        // 3. Handle Disconnect
        socket.on("disconnect", () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
}
