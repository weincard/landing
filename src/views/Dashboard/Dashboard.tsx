"use client";

import { DashboardData } from "@/data/interfaces/dashboard.interface";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  UsersIcon,
  ShoppingCartIcon,
  TargetIcon,
  GiftIcon,
} from "lucide-react";
import Image from "next/image";

interface MetricCardProps {
  title: string;
  value: string | number;
  percentage: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

function MetricCard({
  title,
  value,
  percentage,
  trend,
  icon,
  color,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon;
  const ArrowIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <div
              className={`flex items-center gap-1 text-xs ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <ArrowIcon className="h-3 w-3" />
              <span>{percentage}%</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pagado: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
    };
    return (
      statusClasses[status as keyof typeof statusClasses] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title={data.metrics.revenue.label}
          value={formatCurrency(data.metrics.revenue.value)}
          percentage={data.metrics.revenue.percentage}
          trend={data.metrics.revenue.trend as "up" | "down"}
          icon={<DollarSignIcon className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title={data.metrics.orders.label}
          value={data.metrics.orders.value}
          percentage={data.metrics.orders.percentage}
          trend={data.metrics.orders.trend as "up" | "down"}
          icon={<ShoppingCartIcon className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title={data.metrics.visits.label}
          value={data.metrics.visits.value}
          percentage={data.metrics.visits.percentage}
          trend={data.metrics.visits.trend as "up" | "down"}
          icon={<UsersIcon className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <MetricCard
          title={data.metrics.newUsers.label}
          value={data.metrics.newUsers.value}
          percentage={data.metrics.newUsers.percentage}
          trend={data.metrics.newUsers.trend as "up" | "down"}
          icon={<TargetIcon className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <MetricCard
          title={data.metrics.redemptions.label}
          value={data.metrics.redemptions.value}
          percentage={data.metrics.redemptions.percentage}
          trend={data.metrics.redemptions.trend as "up" | "down"}
          icon={<GiftIcon className="h-6 w-6 text-white" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios vs tiempo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Usuarios vs. tiempo
            </CardTitle>
            <Select defaultValue="2025">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-2xl font-bold">645</p>
                  <p className="text-muted-foreground">Orders on May 22</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">472</p>
                  <p className="text-muted-foreground">Orders on May 21</p>
                </div>
              </div>
              {/* Aquí iría el gráfico - por ahora placeholder */}
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Gráfico de usuarios vs tiempo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membresías vendidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Membresías vendidas
            </CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold">1,259</p>
                <p className="text-muted-foreground">Membresías vendidas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(12546000)}</p>
                <p className="text-muted-foreground">Ganancias</p>
              </div>
              {/* Aquí iría el gráfico de barras - por ahora placeholder */}
              <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de membresías</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top miembros */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Top miembros</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Últ. redención</TableHead>
                  <TableHead>Ahorro</TableHead>
                  <TableHead>Redenciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.members.slice(0, 5).map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      {formatDate(member.lastRedemptionDate)}
                    </TableCell>
                    <TableCell>{formatCurrency(member.saving)}</TableCell>
                    <TableCell>{member.totalRedemptions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top aliados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Top aliados</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Redenciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.allies.slice(0, 5).map((ally) => (
                  <TableRow key={ally.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={ally.image}
                            alt={ally.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{ally.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(parseInt(ally.sales))}
                    </TableCell>
                    <TableCell>{ally.totalRedemptions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
