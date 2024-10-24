import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/session";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import AlertLogout from "./alert-logout";

export default async function Page() {
  const session = await getAuthSession();

  if (!session)
    return (
      <>
        <p>
          Anda belum login, silahkan login terlebih dahulu melalui link berikut
        </p>
        <Button asChild>
          <Link href={"/auth/login"}>
            <ExternalLinkIcon />
            Masuk
          </Link>
        </Button>
      </>
    );

  return (
    <>
      <div>
        <p className="text-2xl font-semibold mx-4 mt-4">Akun Saya</p>

        <Card className="mx-4 mt-4">
          <CardHeader className="p-4 space-y-0">
            <CardTitle className="text-lg">{session.name}</CardTitle>
            <CardDescription>{session.email}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-end p-4 pt-0">
            <AlertLogout />
          </CardFooter>
        </Card>

        <p className="font-semibold text-lg mx-4 mt-4">Pesanan Saya</p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum rem
          accusantium velit saepe culpa, magni dolore commodi nam, ut, molestiae
          hic atque a. Optio sequi quae, molestiae deleniti veritatis
          perspiciatis.
        </p>
      </div>
    </>
  );
}
