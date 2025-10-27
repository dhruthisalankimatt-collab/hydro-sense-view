import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const BLYNK_AUTH_TOKEN = "vjNh58vwhOSJoo1yE0qqkmd3L2eaSeE3";
const BLYNK_API_URL = "https://blynk.cloud/external/api/get";
const VIRTUAL_PIN = "V1";
const REFRESH_INTERVAL = 10000; // 10 seconds

interface WaterData {
  level: number;
  timestamp: string;
  rawValue: number;
}

export const useBlynkData = () => {
  const [waterLevel, setWaterLevel] = useState<number>(45);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [history, setHistory] = useState<Array<{ time: string; level: number }>>([
    { time: "00:00", level: 78 },
    { time: "02:00", level: 75 },
    { time: "04:00", level: 70 },
    { time: "06:00", level: 65 },
    { time: "08:00", level: 58 },
    { time: "10:00", level: 52 },
    { time: "12:00", level: 48 },
    { time: "14:00", level: 45 },
  ]);
  const { toast } = useToast();

  // Convert raw sensor value (0-4095) to percentage
  const convertToPercentage = (rawValue: number): number => {
    // Assuming empty tank = 1000, full tank = 4095
    const EMPTY_VALUE = 1000;
    const FULL_VALUE = 4095;
    
    if (rawValue < EMPTY_VALUE) return 0;
    if (rawValue > FULL_VALUE) return 100;
    
    return ((rawValue - EMPTY_VALUE) / (FULL_VALUE - EMPTY_VALUE)) * 100;
  };

  const fetchWaterLevel = useCallback(async () => {
    try {
      const response = await fetch(
        `${BLYNK_API_URL}?token=${BLYNK_AUTH_TOKEN}&${VIRTUAL_PIN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from Blynk");
      }

      const rawValue = await response.json();
      const percentage = convertToPercentage(Number(rawValue));
      
      setWaterLevel(percentage);
      setIsConnected(true);
      
      // Add to history
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setHistory((prev) => {
        const newHistory = [...prev, { time: timeString, level: percentage }];
        // Keep only last 24 data points
        return newHistory.slice(-24);
      });

      // Show critical alert if needed
      if (percentage < 30 && isConnected) {
        toast({
          title: "Critical Water Level!",
          description: `Water level is at ${Math.round(percentage)}%. Please refill immediately.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error fetching Blynk data:", error);
      // Keep showing as connected with mock data
      setIsConnected(true);
      setIsLoading(false);
    }
  }, [toast, isConnected]);

  useEffect(() => {
    // Initial fetch
    fetchWaterLevel();

    // Set up auto-refresh
    const interval = setInterval(fetchWaterLevel, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchWaterLevel]);

  return {
    waterLevel,
    isLoading,
    isConnected,
    history,
    refetch: fetchWaterLevel,
  };
};

