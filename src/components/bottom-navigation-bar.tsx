"use client";

import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  HomeIcon,
  MessagesSquareIcon,
  SettingsIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
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
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex justify-center pb-4 px-4 transition-transform duration-300 z-99"
      )}
    >
      <nav
        className={cn(
          "border shadow-lg rounded-full max-w-[480px] w-full",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}
      >
        <div className="flex justify-around">
          {menus.map((menu, index) => (
            <Link
              key={`menuItem-${index}`}
              href={menu.href}
              className={cn(
                "flex flex-col items-center py-2 px-4",
                theme === "dark" ? "text-gray-400" : "text-muted-foreground",
                pathname === menu.href &&
                  (theme === "dark" ? "text-indigo-400" : "text-indigo-600")
              )}
            >
              {menu.icon}
              <span className="text-xs mt-1">{menu.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
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
