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
    title: "Cupones",
    href: "/dashboard/coupons",
    icon: CreditCard,
  },
];

export { mainItems };
