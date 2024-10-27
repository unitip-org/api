import NavbarComponent from "@/components/navbar";
import { verifyAuthToken } from "@/lib/auth-token";
import { redirect } from "next/navigation";
import { getOtherProfile } from "./actions";
import Client from "./client";

export default async function Page(props: { params: { userId: string } }) {
  const session = await verifyAuthToken();

  if (!session) return redirect("/auth/login");

  const otherProfile = await getOtherProfile({
    otherUserId: props.params.userId,
  });

  return (
    <>
      <NavbarComponent title={otherProfile?.name} />

      <Client
        authenticatedUser={{ id: session.id }}
        toUser={{ id: props.params.userId }}
      />
    </>
  );
}
