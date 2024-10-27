import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { verifyAuthToken } from "@/lib/auth-token";
import { Metadata } from "next";
import Link from "next/link";
import ButtonLogout from "./button-logout";

export const metadata: Metadata = {
  title: "Setelan | Unitip",
};

export default async function Page() {
  try {
    const session = await verifyAuthToken();

    return (
      <>
        <div className="pt-24 px-4">
          {/* profile */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-lg font-semibold">{session.name}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>

              <Badge variant="outline" className="mt-2">
                Driver
              </Badge>
            </div>
          </div>

          <Separator className="mt-8" />

          {/* options */}
          <div className="mt-4">
            <p className="font-semibold text-lg">Pengaturan</p>

            <div className="mt-4">
              <ButtonLogout />
            </div>
          </div>
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <div className="pt-20">
          <p>Unauthorized</p>
          <p>Anda belum login</p>
          <Link href={"/auth/login"}>ke halaman login</Link>
        </div>
      </>
    );
  }
}
