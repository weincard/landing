import { Users, Store, CreditCard, Home, List, Tag, Gift } from "lucide-react";
import { BsCardChecklist } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import { MdCardMembership } from "react-icons/md";
import { PiConfettiFill } from "react-icons/pi";

// Items principales
const mainItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Redenciones",
    href: "/dashboard/redemptions",
    icon: BsCardChecklist,
  },
  {
    title: "Aliados",
    href: "/dashboard/allies",
    icon: FaHandsHelping,
  },
  {
    title: "Sucursales",
    href: "/dashboard/branches",
    icon: MdCardMembership,
  },
  {
    title: "Cupones",
    href: "/dashboard/coupons",
    icon: PiConfettiFill,
  },
  {
    title: "Regalos",
    href: "/dashboard/gifts",
    icon: Gift,
  },
];

export { mainItems };
