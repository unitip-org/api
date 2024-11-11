import DriverCounter from "./driver-counter";
import TestCounter from "./test-counter";

export default function Page() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, omnis
        recusandae magnam, nesciunt vel cumque iure, sed mollitia praesentium
        enim velit aperiam optio similique! Cumque veniam magnam et optio
        molestias?
      </p>

      <TestCounter />
      <DriverCounter />
    </>
  );
}
