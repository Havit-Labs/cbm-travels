import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/bookings",
        title: "Bookings",
        icon: Globe,
      },
      {
        href: "/drivers",
        title: "Drivers",
        icon: Globe,
      },
      {
        href: "/vehicles",
        title: "Vehicles",
        icon: Globe,
      },
      {
        href: "/passengers",
        title: "Passengers",
        icon: Globe,
      },
    ],
  },

];

