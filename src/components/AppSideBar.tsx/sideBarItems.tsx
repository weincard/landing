import {
  Package,
  ListTodo,
  Users,
  BarChart2,
  Settings,
  Store,
  PawPrint,
  Stethoscope,
  CreditCard,
  ImageIcon,
  Home,
  TreePineIcon,
  ListIcon,
  List,
  Tag,
  Folder,
  ChartColumnBigIcon,
  MessageCircleQuestion,
  Medal,
  User,
} from "lucide-react";

// Items principales
const mainItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Redenciones",
    href: "/dashboard/redemptions",
    icon: List,
  },
  {
    title: "Aliados",
    href: "/dashboard/allies",
    icon: Tag,
  },
  {
    title: "Categorías",
    href: "/dashboard/categories",
    icon: Folder,
  },
  {
    title: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Reportes",
    href: "/dashboard/reports",
    icon: ChartColumnBigIcon,
  },
  {
    title: "Banners",
    href: "/dashboard/banners",
    icon: ImageIcon,
  },
];

const otherInformationItems = [
  {
    title: "Base de conocimiento",
    href: "/dashboard/knowledge_base",
    icon: MessageCircleQuestion,
  },
  {
    title: "Product Updates",
    href: "/dashboard/product_updates",
    icon: Medal,
  },
];

const settingsItems = [
  {
    title: "Ajustes",
    href: "/dashboard/settings",
    icon: User,
  },
  {
    title: "Global Settings",
    href: "/dashboard/global_settings",
    icon: Settings,
  },
];

// Items del catálogo
const oldItems = [
  {
    title: "Productos",
    href: "/dashboard/old/productos",
    icon: Package,
  },
  {
    title: "Categorías",
    href: "/dashboard/old/categorias",
    icon: ListTodo,
  },
  {
    title: "Atributos",
    href: "/dashboard/old/atributos",
    icon: BarChart2,
  },
  {
    title: "Marcas",
    href: "/dashboard/old/marcas",
    icon: Package,
  },
  {
    title: "Lista de Mascotas",
    href: "/dashboard/old/mascotas",
    icon: ListIcon,
  },
  {
    title: "Especies",
    href: "/dashboard/old/especies",
    icon: TreePineIcon,
  },
  {
    title: "Razas",
    href: "/dashboard/old/razas",
    icon: PawPrint,
  },
  {
    title: "Condiciones médicas",
    href: "/dashboard/old/condiciones_medicas",
    icon: Stethoscope,
  },
  {
    title: "Lista de tiendas",
    href: "/dashboard/old/tiendas/lista_tiendas",
    icon: Store,
  },
  {
    title: "Solicitudes de surtido",
    href: "/dashboard/old/tiendas/solicitudes_surtido",
    icon: Package,
  },
  {
    title: "Gestión de pagos",
    href: "/dashboard/old/tiendas/gestion_pagos",
    icon: CreditCard,
  },
];

export { mainItems, otherInformationItems, settingsItems, oldItems };
