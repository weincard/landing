import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MembershipChartProps {
  count: number;
  profits: number;
}

export const MembershipChart: React.FC<MembershipChartProps> = ({
  count,
  profits,
}) => {
  // Datos mock para el gráfico basado en el diseño
  const chartData = React.useMemo(() => {
    const months = ["08", "09", "10", "11", "12", "13", "14"];
    return months.map((month, index) => ({
      month,
      value: Math.floor(Math.random() * 3000) + 1000, // Datos simulados
    }));
  }, []);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Membresías vendidas
        </CardTitle>
        <div className="space-y-2">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {count.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Membresías vendidas
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              ${(profits / 1000000).toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Ganancias</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value ?? 0).toLocaleString()}`,
                  "Ventas",
                ]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
