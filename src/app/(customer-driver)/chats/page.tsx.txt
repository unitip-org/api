import { verifyAuthToken } from "@/lib/auth-token";
import { Metadata } from "next";
import ButtonCreateChat from "./button-create-chat";
import ListChats from "./list-chats";

export const metadata: Metadata = {
  title: "Percakapan | Unitip",
};

export default async function Page() {
  try {
    const session = await verifyAuthToken();

    return (
      <>
        <div>
          <div className="px-4 pt-4 flex items-center gap-2">
            <div className="flex-1">
              <p className="text-lg font-semibold">Percakapan</p>
              <p className="text-muted-foreground text-sm">
                Berikut daftar beberapa percakapan antara Anda dan driver yang
                sedang berlangsung. Percakapan ini bersifat pribadi dan akan
                dihapus ketika orderan telah selesai.
              </p>
            </div>

            <ButtonCreateChat />
          </div>

          <div className="mt-4">
            <ListChats authenticatedUserId={session.id} />
          </div>
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <p>Unauthorized!</p>
      </>
    );
  }
}
