"use client";

import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  HomeIcon,
  MessagesSquareIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const menus: {
  title: string;
  href: string;
  icon: ReactNode;
}[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <HomeIcon />,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Chats",
    href: "/chats",
    icon: <MessagesSquareIcon />,
  },
  {
    title: "Settings",
    href: "/account",
    icon: <SettingsIcon />,
  },
];

// deprecated
export default function BottomNavbarComponent() {
  const pathname = usePathname();

  return (
    <>
      <div className="grid grid-cols-4 border-t fixed bottom-0 max-w-[512px] w-full z-20 bg-background">
        {menus.map((menu, index) => (
          <div key={"menuItem-" + index}>
            <Link
              href={menu.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-16 text-muted-foreground",
                pathname === menu.href && "text-indigo-600"
              )}
            >
              {menu.icon}
              <span className="text-xs">{menu.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
