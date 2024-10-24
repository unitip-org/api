import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className="bg-muted h-screen w-full overflow-hidden">
        <div className="max-w-[512px] mx-auto px-4 overflow-y-auto bg-background shadow h-screen">
          {props.children}
        </div>
      </div>
    </>
  );
}
