import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import FormLogin from "./form-login";

export const metadata: Metadata = {
  title: "Masuk | Unitip",
};

export default function Page() {
  return (
    <>
      <div className="py-4 px-4">
        <p className="text-2xl font-semibold">
          Selamat datang kembali di Unitip
        </p>
        <p className="text-muted-foreground">
          Masukkan beberapa informasi berikut untuk ke akun Anda dan melanjutkan
          menggunakan Unitip.
        </p>

        <div className="mt-4">
          <FormLogin />
        </div>

        <p className="text-muted-foreground text-center text-sm mt-4">
          Belum punya akun Unitip? Daftar sekarang melalui link{" "}
          <Button asChild className="p-0 h-fit" variant={"link"}>
            <Link href={"/auth/register"}>berikut</Link>
          </Button>
        </p>
      </div>
    </>
  );
}
