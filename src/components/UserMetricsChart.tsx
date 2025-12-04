import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMetricsResponse } from "@/modules/users/domain/hooks/use-user-metrics";

interface UserMetricsChartProps {
  data: UserMetricsResponse;
  year: number;
}

export const UserMetricsChart: React.FC<UserMetricsChartProps> = ({
  data,
  year,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Registros de Usuarios por Mes - {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="owners" fill="#3b82f6" name="Propietarios" />
              <Bar dataKey="clients" fill="#10b981" name="Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
