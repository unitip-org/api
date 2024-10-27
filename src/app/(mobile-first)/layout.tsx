import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className="max-w-[512px] mx-auto">{props.children}</div>
    </>
  );
}
