import { Suspense } from "react";
import { DashboardData } from "@/data/interfaces/dashboard.interface";
import DashboardView from "@/views/Dashboard/Dashboard";

async function getDashboardData(): Promise<DashboardData> {
  // Aquí implementarías la lógica para obtener los datos reales
  // Por ahora usamos datos de ejemplo
  return {
    metrics: {
      revenue: {
        value: 10540,
        label: "Ventas totales",
        percentage: 22.45,
        trend: "up",
      },
      orders: {
        value: 1056,
        label: "Membresías",
        percentage: 15.34,
        trend: "up",
      },
      visits: {
        value: 5420,
        label: "Aliados registrados",
        percentage: 10.24,
        trend: "down",
      },
      newUsers: {
        value: 1650,
        label: "Clientes registrados",
        percentage: 15.34,
        trend: "up",
      },
      redemptions: {
        value: 9653,
        label: "Redenciones",
        percentage: 22.45,
        trend: "up",
      },
    },
    salesByDay: [
      { date: "12", amount: 1200 },
      { date: "13", amount: 1800 },
      { date: "14", amount: 1400 },
      { date: "15", amount: 1900 },
      { date: "16", amount: 2525 },
      { date: "17", amount: 2100 },
      { date: "18", amount: 2400 },
    ],
    ordersByHour: [
      { hour: "4am", current: 10, previous: 25 },
      { hour: "5am", current: 15, previous: 8 },
      { hour: "6am", current: 10, previous: 6 },
      { hour: "7am", current: 20, previous: 15 },
      { hour: "8am", current: 34, previous: 25 },
      { hour: "9am", current: 30, previous: 28 },
      { hour: "10am", current: 35, previous: 30 },
      { hour: "11am", current: 50, previous: 45 },
      { hour: "12pm", current: 45, previous: 10 },
      { hour: "1pm", current: 25, previous: 35 },
      { hour: "2pm", current: 25, previous: 40 },
      { hour: "3pm", current: 35, previous: 45 },
    ],
    solicitudSurtido: [
      {
        id: 1,
        nombre: "Jagarnath S.",
        fecha: "24.05.2023",
        productos: 124.97,
        estado: "pagado",
      },
      {
        id: 2,
        nombre: "Anand G.",
        fecha: "23.05.2023",
        productos: 55.42,
        estado: "pendiente",
      },
      {
        id: 3,
        nombre: "Kartik S.",
        fecha: "23.05.2023",
        productos: 89.9,
        estado: "pagado",
      },
      {
        id: 4,
        nombre: "Rakesh S.",
        fecha: "22.05.2023",
        productos: 144.94,
        estado: "pendiente",
      },
      {
        id: 5,
        nombre: "Anup S.",
        fecha: "22.05.2023",
        productos: 70.52,
        estado: "pagado",
      },
    ],
    allies: [
      {
        id: 1,
        name: "Aliado 1",
        sales: "500",
        totalRedemptions: 5,
        image: "/product/Nutre can.png",
      },
      {
        id: 2,
        name: "Aliado 2",
        sales: "300",
        totalRedemptions: 3,
        image: "/product/Nutre can.png",
      },
      {
        id: 3,
        name: "Aliado 3",
        sales: "400",
        totalRedemptions: 4,
        image: "/product/Nutre can.png",
      },
    ],
    members: [
      {
        id: 1,
        name: "Juan Pérez",
        lastRedemptionDate: "2023-05-24",
        saving: 100,
        totalRedemptions: 5,
      },
      {
        id: 2,
        name: "María López",
        lastRedemptionDate: "2023-05-23",
        saving: 200,
        totalRedemptions: 10,
      },
      {
        id: 3,
        name: "Carlos García",
        lastRedemptionDate: "2023-05-22",
        saving: 150,
        totalRedemptions: 8,
      },
    ],
    topProducts: [], // Implementar si se necesita
    ventas: [
      {
        id: 1,
        nombre: "Jagarnath S.",
        fecha: "24.05.2023",
        monto: 124.97,
        estado: "pagado",
      },
      {
        id: 2,
        nombre: "Anand G.",
        fecha: "23.05.2023",
        monto: 55.42,
        estado: "pendiente",
      },
      {
        id: 3,
        nombre: "Kartik S.",
        fecha: "23.05.2023",
        monto: 89.9,
        estado: "pagado",
      },
      {
        id: 4,
        nombre: "Rakesh S.",
        fecha: "22.05.2023",
        monto: 144.94,
        estado: "pendiente",
      },
      {
        id: 5,
        nombre: "Anup S.",
        fecha: "22.05.2023",
        monto: 70.52,
        estado: "pagado",
      },
    ], // Agregar datos de ventas si es necesario
  };
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DashboardView data={dashboardData} />
    </Suspense>
  );
}
