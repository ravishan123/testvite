import { IconUsers, IconUsersGroup } from "@tabler/icons-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Users",
    label: "",
    href: "/users",
    icon: <IconUsers size={18} />,
  },
  {
    title: "Organizations",
    label: "",
    href: "/organizations",
    icon: <IconUsersGroup size={18} />,
  },
];
