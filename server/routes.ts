import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import {
  startSessionRequestSchema,
  settleSessionRequestSchema,
  depositRequestSchema,
  withdrawRequestSchema,
  registerNodeRequestSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // User endpoints
  app.get("/api/users/:address", async (req, res) => {
    try {
      const { address } = req.params;
      let user = await storage.getUserByWalletAddress(address);

      if (!user) {
        user = await storage.createUser({
          walletAddress: address,
          usdcBalance: 100,
          x4pnBalance: 500,
          totalSpent: 0,
          totalEarnedX4pn: 0,
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Deposit endpoint
  app.post("/api/deposits", async (req, res) => {
    try {
      const parsed = depositRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { userAddress, amount } = parsed.data;

      let user = await storage.getUserByWalletAddress(userAddress);
      if (!user) {
        user = await storage.createUser({
          walletAddress: userAddress,
          usdcBalance: 0,
          x4pnBalance: 0,
          totalSpent: 0,
          totalEarnedX4pn: 0,
        });
      }

      const updatedUser = await storage.updateUserBalance(userAddress, amount, 0);

      const transaction = await storage.createTransaction({
        userId: user.id,
        type: "deposit",
        amount,
        token: "usdc",
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: "completed",
      });

      res.json({ user: updatedUser, transaction });
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ error: "Failed to process deposit" });
    }
  });

  // Withdraw endpoint
  app.post("/api/withdrawals", async (req, res) => {
    try {
      const parsed = withdrawRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { userAddress, amount, token } = parsed.data;

      const user = await storage.getUserByWalletAddress(userAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const balance = token === "usdc" ? user.usdcBalance : user.x4pnBalance;
      if (balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const usdcDelta = token === "usdc" ? -amount : 0;
      const x4pnDelta = token === "x4pn" ? -amount : 0;
      const updatedUser = await storage.updateUserBalance(userAddress, usdcDelta, x4pnDelta);

      const transaction = await storage.createTransaction({
        userId: user.id,
        type: "withdrawal",
        amount,
        token,
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: "completed",
      });

      res.json({ user: updatedUser, transaction });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  // Node endpoints
  app.get("/api/nodes", async (req, res) => {
    try {
      const nodes = await storage.getActiveNodes();
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      res.status(500).json({ error: "Failed to fetch nodes" });
    }
  });

  app.get("/api/nodes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const node = await storage.getNode(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      res.json(node);
    } catch (error) {
      console.error("Error fetching node:", error);
      res.status(500).json({ error: "Failed to fetch node" });
    }
  });

  app.get("/api/nodes/operator/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const nodes = await storage.getNodesByOperator(address);
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching operator nodes:", error);
      res.status(500).json({ error: "Failed to fetch operator nodes" });
    }
  });

  app.post("/api/nodes/register", async (req, res) => {
    try {
      const parsed = registerNodeRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const node = await storage.createNode({
        ...parsed.data,
        isActive: true,
        totalEarnedUsdc: 0,
        totalEarnedX4pn: 0,
        activeUsers: 0,
        uptime: 100,
        latency: 50,
      });

      res.json(node);
    } catch (error) {
      console.error("Error registering node:", error);
      res.status(500).json({ error: "Failed to register node" });
    }
  });

  app.patch("/api/nodes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const node = await storage.updateNode(id, updates);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }

      res.json(node);
    } catch (error) {
      console.error("Error updating node:", error);
      res.status(500).json({ error: "Failed to update node" });
    }
  });

  // Session endpoints
  app.get("/api/sessions/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const sessions = await storage.getSessionsByUser(address);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/active/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const session = await storage.getActiveSessionByUser(address);
      res.json(session || null);
    } catch (error) {
      console.error("Error fetching active session:", error);
      res.status(500).json({ error: "Failed to fetch active session" });
    }
  });

  app.post("/api/sessions/start", async (req, res) => {
    try {
      const parsed = startSessionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { nodeId, userAddress } = parsed.data;

      // Check if user has active session
      const existingSession = await storage.getActiveSessionByUser(userAddress);
      if (existingSession) {
        return res.status(400).json({ error: "User already has an active session" });
      }

      // Get node info
      const node = await storage.getNode(nodeId);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }

      if (!node.isActive) {
        return res.status(400).json({ error: "Node is not active" });
      }

      // Get or create user
      let user = await storage.getUserByWalletAddress(userAddress);
      if (!user) {
        user = await storage.createUser({
          walletAddress: userAddress,
          usdcBalance: 100,
          x4pnBalance: 500,
          totalSpent: 0,
          totalEarnedX4pn: 0,
        });
      }

      if (user.usdcBalance <= 0) {
        return res.status(400).json({ error: "Insufficient USDC balance" });
      }

      const sessionId = await storage.getNextSessionId();
      const ratePerSecond = node.ratePerMinute / 60;

      const session = await storage.createSession({
        sessionId,
        userId: user.id,
        nodeId: node.id,
        userAddress: user.walletAddress,
        nodeAddress: node.operatorAddress,
        ratePerSecond,
        startedAt: new Date(),
        lastSettledAt: new Date(),
        totalCost: 0,
        totalDuration: 0,
        x4pnEarned: 0,
        isActive: true,
        status: "active",
      });

      res.json(session);
    } catch (error) {
      console.error("Error starting session:", error);
      res.status(500).json({ error: "Failed to start session" });
    }
  });

  app.post("/api/sessions/settle", async (req, res) => {
    try {
      const parsed = settleSessionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { sessionId } = parsed.data;

      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (!session.isActive) {
        return res.status(400).json({ error: "Session is not active" });
      }

      // Calculate elapsed time server-side for security
      const now = new Date();
      const lastSettled = new Date(session.lastSettledAt);
      const timeElapsed = Math.max(0, Math.floor((now.getTime() - lastSettled.getTime()) / 1000));

      if (timeElapsed <= 0) {
        return res.status(400).json({ error: "Nothing to settle yet" });
      }

      // Get user to check balance
      const user = await storage.getUserByWalletAddress(session.userAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Calculate cost and cap to available balance
      let cost = session.ratePerSecond * timeElapsed;
      if (cost > user.usdcBalance) {
        cost = Math.max(0, user.usdcBalance);
      }

      if (cost <= 0) {
        return res.status(400).json({ error: "Insufficient balance for settlement" });
      }

      const x4pnReward = cost * 10;
      const actualTimeElapsed = Math.floor(cost / session.ratePerSecond);

      // Update user balance
      await storage.updateUserBalance(
        session.userAddress,
        -cost,
        x4pnReward,
        cost,
        x4pnReward
      );

      // Update node earnings
      await storage.updateNodeEarnings(session.nodeId, cost, x4pnReward);

      // Update session
      const updatedSession = await storage.updateSession(sessionId, {
        totalCost: session.totalCost + cost,
        totalDuration: session.totalDuration + actualTimeElapsed,
        x4pnEarned: session.x4pnEarned + x4pnReward,
        lastSettledAt: now,
      });

      res.json(updatedSession);
    } catch (error) {
      console.error("Error settling session:", error);
      res.status(500).json({ error: "Failed to settle session" });
    }
  });

  app.post("/api/sessions/end", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const session = await storage.endSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error ending session:", error);
      res.status(500).json({ error: "Failed to end session" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const nodes = await storage.getAllNodes();
      const totalNodes = nodes.length;
      const activeNodes = nodes.filter((n) => n.isActive).length;
      const totalUsers = nodes.reduce((sum, n) => sum + n.activeUsers, 0);
      const avgLatency =
        nodes.length > 0
          ? Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length)
          : 0;

      res.json({
        totalNodes,
        activeNodes,
        totalUsers,
        avgLatency,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
