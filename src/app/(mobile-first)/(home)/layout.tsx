import BottomNavigation from "@/components/bottom-navigation-bar";
import NavbarComponent from "@/components/navbar";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className="h-screen w-full overflow-hidden">
        {/* top navbar */}
        <NavbarComponent />

        <div className="max-w-lg mx-auto bg-background h-screen">
          {/* content */}
          <div className="h-[calc(100vh-8rem)] overflow-y-auto my-16">
            {props.children}
          </div>

          {/* bottom navbar */}
          <BottomNavigation />
        </div>
      </div>
    </>
  );
}
