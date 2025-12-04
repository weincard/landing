import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { UserMetricsResponse } from "@/modules/users/domain/hooks/use-user-metrics";

interface UserMetricsChartProps {
  data: UserMetricsResponse;
  year: number;
  onYearChange?: (year: number) => void;
  isLoading?: boolean;
}

export const UserMetricsChart: React.FC<UserMetricsChartProps> = ({
  data,
  year,
  onYearChange,
  isLoading = false,
}) => {
  // Combinar los datos de owners y clients en un formato para recharts
  const chartData = React.useMemo(() => {
    if (!data?.metrics) return [];

    return data.metrics.map((item) => ({
      month: new Date(
        `${item.year}-${item.month.toString().padStart(2, "0")}-01`
      ).toLocaleDateString("es", {
        month: "short",
      }),
      owners: item.owner || 0,
      clients: item.client || 0,
    }));
  }, [data]);

  // Generar años desde 2000 hasta el año actual
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let y = currentYear; y >= 2000; y--) {
      yearList.push(y);
    }
    return yearList;
  }, []);

  const totalUsers = React.useMemo(() => {
    if (!data?.metrics) return 0;
    return data.metrics.reduce(
      (acc, curr) => acc + (curr.owner || 0) + (curr.client || 0),
      0
    );
  }, [data]);

  const maxMonthlyUsers = React.useMemo(() => {
    if (!data?.metrics) return 0;
    return Math.max(
      ...data.metrics.map((m) => (m.owner || 0) + (m.client || 0))
    );
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Usuarios vs. tiempo
          </CardTitle>
          <Select
            value={year.toString()}
            onValueChange={(value) => onYearChange?.(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estadísticas debajo del título */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {totalUsers}
            </div>
            <div className="text-sm text-muted-foreground">Total registros</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {maxMonthlyUsers}
            </div>
            <div className="text-sm text-muted-foreground">Máximo mensual</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Cargando datos...
                </span>
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Line
                dataKey="owners"
                stroke="#94a3b8"
                strokeWidth={2}
                name="Propietarios"
                dot={{ fill: "#94a3b8", strokeWidth: 2, r: 4 }}
              />
              <Line
                dataKey="clients"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Usuario"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
