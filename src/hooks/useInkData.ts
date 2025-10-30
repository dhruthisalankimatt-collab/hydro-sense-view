import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const BLYNK_AUTH_TOKEN = "vjNh58vwhOSJoo1yE0qqkmd3L2eaSeE3";
const BLYNK_API_URL = "https://blynk.cloud/external/api/get";
const VIRTUAL_PIN = "V1";
const REFRESH_INTERVAL = 10000; // 10 seconds

interface InkData {
  level: number;
  timestamp: string;
  rawValue: number;
}

export const useInkData = () => {
  const [inkLevel, setInkLevel] = useState<number>(75);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [history, setHistory] = useState<Array<{ time: string; level: number }>>([]);
  const { toast } = useToast();

  // Convert raw sensor value (0-4095) to percentage
  const convertToPercentage = (rawValue: number): number => {
    // Assuming empty cartridge = 1000, full cartridge = 4095
    const EMPTY_VALUE = 1000;
    const FULL_VALUE = 4095;
    
    if (rawValue < EMPTY_VALUE) return 0;
    if (rawValue > FULL_VALUE) return 100;
    
    return ((rawValue - EMPTY_VALUE) / (FULL_VALUE - EMPTY_VALUE)) * 100;
  };

  const fetchInkLevel = useCallback(async () => {
    try {
      const response = await fetch(
        `${BLYNK_API_URL}?token=${BLYNK_AUTH_TOKEN}&${VIRTUAL_PIN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from Blynk");
      }

      const rawValue = await response.json();
      const percentage = convertToPercentage(Number(rawValue));
      
      setInkLevel(percentage);
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
          title: "Critical Ink Level!",
          description: `Ink level is at ${Math.round(percentage)}%. Please replace cartridge immediately.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error fetching Blynk data:", error);
      setIsConnected(true);
      
      // Add mock data to history even when API fails
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setHistory((prev) => {
        const newHistory = [...prev, { time: timeString, level: inkLevel }];
        return newHistory.slice(-24);
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, isConnected, inkLevel]);

  useEffect(() => {
    // Initial fetch
    fetchInkLevel();

    // Set up auto-refresh
    const interval = setInterval(fetchInkLevel, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchInkLevel]);

  return {
    inkLevel,
    isLoading,
    isConnected,
    history,
    refetch: fetchInkLevel,
  };
};
