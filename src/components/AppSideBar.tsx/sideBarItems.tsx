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
    title: "Sucursales",
    href: "/dashboard/branches",
    icon: Store,
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

export { mainItems, otherInformationItems, settingsItems };
