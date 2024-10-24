import NavbarComponent from "@/components/navbar";
import {
  BriefcaseIcon,
  HomeIcon,
  MessagesSquareIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

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
    title: "Profile",
    href: "/account",
    icon: <UserIcon />,
  },
];

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className="bg-muted h-screen overflow-auto relative">
        <div className="max-w-[512px] mx-auto bg-background h-screen overflow-y-auto relative">
          <NavbarComponent />

          {props.children}

          <div className="grid grid-cols-4 fixed bottom-0 backdrop-blur max-w-[512px] w-full z-20 h-16 border-t select-none">
            {menus.map((menu, index) => (
              <div key={"menuItem-" + index}>
                <Link
                  href={menu.href}
                  className="flex flex-col items-center justify-center gap-1 h-16"
                >
                  {menu.icon}
                  <span className="text-xs">{menu.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
