"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutCustomer = async () => {
  const cookieStore = cookies();
  cookieStore.delete("auth-token");

  return redirect("/");
};
