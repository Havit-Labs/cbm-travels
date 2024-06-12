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
  { href: "/bookings/create", title: "Create Booking", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Manage Trips",
    links: [
      {
        href: "/passengers",
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
     
    ],
  },

];

