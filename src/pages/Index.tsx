import { InkLevel } from "@/components/InkLevel";
import { InkChart } from "@/components/InkChart";
import { AlertBanner } from "@/components/AlertBanner";
import { DashboardStats } from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { useInkData } from "@/hooks/useInkData";
import { RefreshCw, Printer } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const { inkLevel, isLoading, isConnected, history, refetch } = useInkData();
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [inkLevel]);

  const getStatus = () => {
    if (inkLevel > 60) return "normal";
    if (inkLevel > 30) return "low";
    return "critical";
  };

  return (
    <div className="min-h-screen bg-gradient-printer">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <Printer className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Printer Ink Monitor</h1>
                <p className="text-muted-foreground">Real-time IoT Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isConnected ? "bg-status-normal/20 text-status-normal" : "bg-status-critical/20 text-status-critical"
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-status-normal animate-pulse" : "bg-status-critical"}`} />
                <span className="font-semibold">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
              <Button onClick={refetch} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Alert Banner */}
          <AlertBanner level={inkLevel} />

          {/* Stats Grid */}
          <DashboardStats
            level={inkLevel}
            lastUpdated={lastUpdated}
            status={getStatus() as "normal" | "low" | "critical"}
            trend="stable"
          />

          {/* Cartridge and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ink Level Visualization */}
            <div className="flex justify-center items-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                  <p className="text-muted-foreground">Loading ink level...</p>
                </div>
              ) : (
                <InkLevel level={inkLevel} />
              )}
            </div>

            {/* Historical Chart */}
            <div className="flex items-center">
              {history.length > 0 ? (
                <InkChart data={history} />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center bg-card rounded-lg shadow-xl">
                  <p className="text-muted-foreground">Collecting data...</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Auto Refresh</h3>
              <p className="text-muted-foreground">Data updates every 10 seconds automatically</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Smart Alerts</h3>
              <p className="text-muted-foreground">Get notified when ink level is critical</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Real-time Monitoring</h3>
              <p className="text-muted-foreground">Live data from your IoT sensor via Blynk</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-lg border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>Powered by Blynk IoT • Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
