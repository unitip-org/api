import NavbarComponent from "@/components/navbar";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      {/* navbar */}
      <NavbarComponent />
      <div className="max-w-[512px] mx-auto pt-16">{props.children}</div>
    </>
  );
}
