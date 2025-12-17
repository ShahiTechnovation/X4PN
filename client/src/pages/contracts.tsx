import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileCode,
  ExternalLink,
  Copy,
  CheckCircle2,
  Code,
  Terminal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const CONTRACT_ADDRESSES = {
  mumbai: {
    x4pnToken: "0x...",
    vpnSessions: "0x...",
    usdc: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
  },
  polygon: {
    x4pnToken: "0x...",
    vpnSessions: "0x...",
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
};

const X4PN_TOKEN_ABI = `[
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)"
]`;

const VPN_SESSIONS_ABI = `[
  "function depositUsdc(uint256 amount)",
  "function withdrawUsdc(uint256 amount)",
  "function startSession(address node, uint256 rate) returns (uint256)",
  "function settleSession(uint256 sessionId, uint256 timeElapsed)",
  "function endSession(uint256 sessionId)",
  "function registerNode(uint256 minRate)",
  "function getSession(uint256 sessionId) view returns (tuple)",
  "function getUserBalance(address user) view returns (uint256, uint256)"
]`;

export default function Contracts() {
  const { toast } = useToast();
  const [network, setNetwork] = useState<"mumbai" | "polygon">("mumbai");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="p-6 space-y-8" data-testid="page-contracts">
      <div>
        <h1 className="text-3xl font-bold">Smart Contracts</h1>
        <p className="text-muted-foreground">
          Contract addresses, ABIs, and deployment information
        </p>
      </div>

      <Tabs value={network} onValueChange={(v) => setNetwork(v as "mumbai" | "polygon")}>
        <TabsList>
          <TabsTrigger value="mumbai" data-testid="tab-mumbai">
            Mumbai Testnet
          </TabsTrigger>
          <TabsTrigger value="polygon" data-testid="tab-polygon">
            Polygon Mainnet
          </TabsTrigger>
        </TabsList>

        <TabsContent value={network} className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                X4PN Token (ERC20)
              </CardTitle>
              <CardDescription>
                The governance and rewards token for the X4PN VPN protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                  <code className="text-sm font-mono">
                    {CONTRACT_ADDRESSES[network].x4pnToken}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(CONTRACT_ADDRESSES[network].x4pnToken, "Address")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://${network === "mumbai" ? "mumbai." : ""}polygonscan.com/address/${CONTRACT_ADDRESSES[network].x4pnToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ABI (Simplified)</span>
                </div>
                <ScrollArea className="h-32 rounded-md border p-3">
                  <pre className="text-xs font-mono">{X4PN_TOKEN_ABI}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                X4PN VPN Sessions
              </CardTitle>
              <CardDescription>
                Main contract handling VPN sessions, payments, and settlements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                  <code className="text-sm font-mono">
                    {CONTRACT_ADDRESSES[network].vpnSessions}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(CONTRACT_ADDRESSES[network].vpnSessions, "Address")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://${network === "mumbai" ? "mumbai." : ""}polygonscan.com/address/${CONTRACT_ADDRESSES[network].vpnSessions}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ABI (Simplified)</span>
                </div>
                <ScrollArea className="h-32 rounded-md border p-3">
                  <pre className="text-xs font-mono">{VPN_SESSIONS_ABI}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Deployment Guide
              </CardTitle>
              <CardDescription>
                Steps to deploy contracts to {network === "mumbai" ? "Mumbai Testnet" : "Polygon Mainnet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Set up environment variables</p>
                    <code className="text-xs text-muted-foreground block mt-1">
                      PRIVATE_KEY=your_deployer_private_key
                    </code>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Compile contracts</p>
                    <code className="text-xs text-muted-foreground block mt-1">
                      npx hardhat compile
                    </code>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Deploy to network</p>
                    <code className="text-xs text-muted-foreground block mt-1">
                      npx hardhat run scripts/deploy.js --network {network}
                    </code>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium">Verify on PolygonScan</p>
                    <code className="text-xs text-muted-foreground block mt-1">
                      npx hardhat verify --network {network} CONTRACT_ADDRESS
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
