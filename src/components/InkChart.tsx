import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface InkChartProps {
  data: Array<{ time: string; level: number }>;
}

export const InkChart = ({ data }: InkChartProps) => {
  return (
    <Card className="p-6 shadow-xl bg-gradient-to-br from-card to-card/50">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Ink Level History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="inkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Area
            type="monotone"
            dataKey="level"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#inkGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
