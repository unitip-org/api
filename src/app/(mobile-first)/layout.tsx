import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className="max-w-[512px] mx-auto relative">{props.children}</div>
    </>
  );
}
