import BottomNavigation from "@/components/bottom-navigation-bar";
import NavbarComponent from "@/components/navbar";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div>
        {/* top navbar */}
        <NavbarComponent />

        {/* content */}
        <div>{props.children}</div>

        {/* bottom navbar */}
        <BottomNavigation />
      </div>
    </>
  );
}
