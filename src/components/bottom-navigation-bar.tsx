"use client";

import { cn } from "@/lib/utils";
import {
  BriefcaseBusinessIcon,
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
    icon: <HomeIcon className="size-6" />,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Penawaran",
    href: "/jobs-v2",
    icon: <BriefcaseBusinessIcon />,
  },
  {
    title: "Chats",
    href: "/chats",
    icon: <MessagesSquareIcon />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  // const [isVisible, setIsVisible] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  // const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  // const controlNavbar = useCallback(() => {
  //   if (typeof window !== "undefined") {
  //     if (window.scrollY > lastScrollY) {
  //       // jika scroll ke bawah, sembunyikan navbar
  //       setIsVisible(false);
  //     } else {
  //       // jika scroll ke atas, tampilkan navbar
  //       setIsVisible(true);
  //     }

  //     // update last scroll position
  //     setLastScrollY(window.scrollY);
  //   }
  //   setLastInteractionTime(Date.now());
  // }, [lastScrollY]);

  // // callback untuk menampilkan navbar ketika ada interaksi
  // const handleInteraction = useCallback(() => {
  //   setIsVisible(true);
  //   setLastInteractionTime(Date.now());
  // }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.addEventListener("scroll", controlNavbar);
  //     window.addEventListener("touchstart", handleInteraction);
  //     window.addEventListener("mousemove", handleInteraction);

  //     // cleanup function
  //     return () => {
  //       window.removeEventListener("scroll", controlNavbar);
  //       window.removeEventListener("touchstart", handleInteraction);
  //       window.removeEventListener("mousemove", handleInteraction);
  //     };
  //   }
  // }, [controlNavbar, handleInteraction]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (Date.now() - lastInteractionTime > 2000) {
  //       setIsVisible(false);
  //     }
  //   }, 1000); // dicek setiap 1 detik

  //   return () => clearInterval(timer);
  // }, [lastInteractionTime]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex justify-center pb-4 px-4 transition-transform duration-300 z-20"
      )}>
      <nav className="bg-white border shadow-lg rounded-full overflow-hidden max-w-[480px] w-full">
        <div className="grid grid-cols-5 px-4 h-16">
          {menus.map((menu, index) => (
            <Link
              key={`menuItem-${index}`}
              href={menu.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 text-muted-foreground hover:bg-muted duration-300",
                pathname === menu.href && "text-indigo-600"
              )}>
              {menu.icon}
              {pathname === menu.href && (
                <span className="text-xs mt-1">{menu.title}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
