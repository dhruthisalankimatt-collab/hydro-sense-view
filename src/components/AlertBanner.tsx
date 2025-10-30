import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  level: number;
  message?: string;
}

export const AlertBanner = ({ level, message }: AlertBannerProps) => {
  if (level >= 30) return null;

  return (
    <Alert variant="destructive" className="animate-fade-in shadow-lg border-2">
      <AlertTriangle className="h-5 w-5 animate-pulse" />
      <AlertTitle className="text-lg font-bold">Critical Ink Level!</AlertTitle>
      <AlertDescription className="text-base">
        {message || `Ink level is critically low at ${Math.round(level)}%. Please replace cartridge immediately.`}
      </AlertDescription>
    </Alert>
  );
};
