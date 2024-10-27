"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  try {
    const cookieStore = cookies();
    cookieStore.delete("auth-token");
    return true;
  } catch (e) {
    throw e;
  }
};
