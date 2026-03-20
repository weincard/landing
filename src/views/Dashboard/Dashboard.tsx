"use client";

import React, { useEffect, useState } from "react";
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
  UsersIcon,
  ShoppingCartIcon,
  TargetIcon,
  GiftIcon,
  Loader2,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";

import Image from "next/image";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useCoupons } from "@/modules/coupons/domain/hooks/use-coupons";
import { useUserMetrics } from "@/modules/users/domain/hooks/use-user-metrics";
import { useMembershipMetrics } from "@/modules/memberships/domain/hooks/use-membership-metrics";
import { useRedemptions } from "@/modules/redemptions/domain/hooks/use-redemptions";
import { AllUsersResponse } from "@/modules/users/data/interfaces/users.response.interface";
import { AllMerchantsResponse } from "@/modules/merchants/data/interfaces/merchants.response.interface";
import { AllBranchesResponse } from "@/modules/branches/data/interfaces/branches.response.interface";
import { AllCouponsResponse } from "@/modules/coupons/data/interfaces/coupons.response.interface";
import { UserMetricsResponse } from "@/modules/users/domain/hooks/use-user-metrics";
import { MembershipMetricsResponse } from "@/modules/memberships/domain/hooks/use-membership-metrics";
import { RedemptionMetricsResponse } from "@/modules/redemptions/data/interfaces/redemptions.response.interface";
import { UserMetricsChart, MembershipChart } from "@/components";

interface MetricCardProps {
  title: string;
  value: string | number;
  percentage: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function MetricCard({
  title,
  value,
  percentage,
  trend,
  icon,
  color,
  bgColor,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className={`p-3 rounded-lg ${bgColor} flex-shrink-0`}>
              <div className={color}>{icon}</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold break-words">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <div
              className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"
                }`}
            >
              <TrendIcon className="h-3 w-3" />
              <span>{percentage}%</span>
            </div>
          </div>
        </div>
        <div
          className={`absolute bottom-0 right-0 w-24 h-16 ${bgColor} opacity-10 rounded-tl-3xl`}
        />
      </CardContent>
    </Card>
  );
}
interface DashboardViewProps {
  token: string;
}

export default function DashboardView({ token }: DashboardViewProps) {
  const {
    getAllUsers,
    loading: isLoadingUsers,
    error: usersError,
  } = useUsers();
  const {
    getAllMerchants,
    loading: isLoadingMerchants,
    error: merchantsError,
  } = useMerchants();
  const {
    getAllBranches,
    loading: isLoadingBranches,
    error: branchesError,
  } = useBranches();
  const {
    getAllCoupons,
    loading: isLoadingCoupons,
    error: couponsError,
  } = useCoupons();

  const {
    getUserRegistrationMetrics,
    loading: isLoadingUserMetrics,
    error: userMetricsError,
  } = useUserMetrics();

  const {
    getMembershipCountAndProfits,
    loading: isLoadingMembershipMetrics,
    error: membershipMetricsError,
  } = useMembershipMetrics();

  const {
    getMetrics: getRedemptionMetrics,
    loading: isLoadingRedemptionMetrics,
    error: redemptionMetricsError,
  } = useRedemptions();

  const loading =
    isLoadingUsers ||
    isLoadingMerchants ||
    isLoadingBranches ||
    isLoadingCoupons ||
    isLoadingUserMetrics ||
    isLoadingMembershipMetrics ||
    isLoadingRedemptionMetrics;
  const error =
    usersError ||
    merchantsError ||
    branchesError ||
    couponsError ||
    userMetricsError ||
    membershipMetricsError ||
    redemptionMetricsError;

  const [userData, setUserData] = useState<AllUsersResponse>();
  const [merchantData, setMerchantData] = useState<AllMerchantsResponse>();
  const [branchData, setBranchData] = useState<AllBranchesResponse>();
  const [couponData, setCouponData] = useState<AllCouponsResponse>();
  const [userMetrics, setUserMetrics] = useState<UserMetricsResponse>();
  const [membershipMetrics, setMembershipMetrics] =
    useState<MembershipMetricsResponse>();
  const [redemptionMetrics, setRedemptionMetrics] =
    useState<RedemptionMetricsResponse>();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoadingYearChange, setIsLoadingYearChange] = useState(false);

  const handleYearChange = async (year: number) => {
    setIsLoadingYearChange(true);
    setSelectedYear(year);
    try {
      const userMetricsData = await getUserRegistrationMetrics(year, token);
      setUserMetrics(userMetricsData || undefined);
    } catch (error) {
      console.error("Error fetching year metrics:", error);
    } finally {
      setIsLoadingYearChange(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Solo obtener datos necesarios para el dashboard, no todos
      const users = await getAllUsers(token, { skip: 0, limit: 10 });
      setUserData(users || undefined);

      const merchants = await getAllMerchants(token, { skip: 0, limit: 10 });
      setMerchantData(merchants || undefined);

      const branches = await getAllBranches(undefined, token, {
        skip: 0,
        limit: 10,
      });
      setBranchData(branches || undefined);

      const coupons = await getAllCoupons(token, { skip: 0, limit: 10 });
      setCouponData(coupons || undefined);

      // Obtener métricas de usuarios del año seleccionado
      const userMetricsData = await getUserRegistrationMetrics(
        selectedYear,
        token
      );
      setUserMetrics(userMetricsData || undefined);

      // Obtener métricas de membresías
      const membershipMetricsData = await getMembershipCountAndProfits(token);
      setMembershipMetrics(membershipMetricsData || undefined);

      // Obtener métricas de redenciones
      const redemptionMetricsData = await getRedemptionMetrics(token);
      setRedemptionMetrics(redemptionMetricsData || undefined);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error al cargar el dashboard</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

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

  const getUserRole = (role: any): string => {
    if (!role) return "client";
    if (typeof role === "string") return role;
    if (typeof role === "object" && role.name) return role.name;
    return "client";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Usuarios"
          value={userData?.count || 0}
          percentage={15}
          trend="up"
          icon={<UsersIcon className="h-6 w-6" />}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <MetricCard
          title="Aliados Registrados"
          value={merchantData?.count || 0}
          percentage={8}
          trend="up"
          icon={<ShoppingCartIcon className="h-6 w-6" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <MetricCard
          title="Sucursales Activas"
          value={branchData?.count || 0}
          percentage={12}
          trend="up"
          icon={<TargetIcon className="h-6 w-6" />}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <MetricCard
          title="Membresías Vendidas"
          value={membershipMetrics?.count || 0}
          percentage={22}
          trend="up"
          icon={<CreditCardIcon className="h-6 w-6" />}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <MetricCard
          title="Ingresos Total"
          value={formatCurrency(membershipMetrics?.profits || 0)}
          percentage={18}
          trend="up"
          icon={<TrendingUpIcon className="h-6 w-6" />}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <MetricCard
          title="Ahorros Logrados"
          value={redemptionMetrics?.totalRedemptions || 0}
          percentage={25}
          trend="up"
          icon={<ShoppingCartIcon className="h-6 w-6" />}
          color="text-rose-600"
          bgColor="bg-rose-100"
        />
        <MetricCard
          title="Códigos Generados"
          value={redemptionMetrics?.totalRedemptionCodesGenerated || 0}
          percentage={10}
          trend="up"
          icon={<CreditCardIcon className="h-6 w-6" />}
          color="text-amber-600"
          bgColor="bg-amber-100"
        />
        <MetricCard
          title="Códigos Validados"
          value={redemptionMetrics?.totalRedemptionCodesUsed || 0}
          percentage={5}
          trend="up"
          icon={<TargetIcon className="h-6 w-6" />}
          color="text-cyan-600"
          bgColor="bg-cyan-100"
        />
        <MetricCard
          title="Premios Totales"
          value={redemptionMetrics?.totalGifts || 0}
          percentage={15}
          trend="up"
          icon={<GiftIcon className="h-6 w-6" />}
          color="text-pink-600"
          bgColor="bg-pink-100"
        />
        <MetricCard
          title="Cupones Disponibles"
          value={couponData?.count || 0}
          percentage={5}
          trend="up"
          icon={<GiftIcon className="h-6 w-6" />}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Metrics Chart - Line Chart */}
        {userMetrics &&
          userMetrics.metrics &&
          userMetrics.metrics.length > 0 && (
            <UserMetricsChart
              data={userMetrics}
              year={selectedYear}
              onYearChange={handleYearChange}
              isLoading={isLoadingYearChange}
            />
          )}

        {/* Membership Chart - Bar Chart */}
        {membershipMetrics && (
          <MembershipChart
            count={membershipMetrics.count}
            profits={membershipMetrics.profits}
          />
        )}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sucursales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Top Sucursales
            </CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchData?.branches.slice(0, 5).map((branch) => (
                  <TableRow key={branch.branchId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {branch.logoUrl ? (
                            <Image
                              src={branch.logoUrl}
                              alt={branch.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {branch.name?.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium">{branch.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{branch.city}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${branch.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {branch.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Aliados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Top Aliados</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantData?.merchants.slice(0, 5).map((merchant) => (
                  <TableRow key={merchant.merchantId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {merchant.logoUrl ? (
                            <Image
                              src={merchant.logoUrl}
                              alt={merchant.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {merchant.name?.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium">{merchant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {merchant.country}, {merchant.state}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Usuarios Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Usuarios Recientes
            </CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData?.users.slice(0, 5).map((user) => (
                  <TableRow key={user.idUsuario}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.name} {user.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs capitalize">
                        {getUserRole(user.role)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {user.isVerified ? "Verificado" : "Pendiente"}
                      </span>
                    </TableCell>
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
