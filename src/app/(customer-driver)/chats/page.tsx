import { Metadata } from "next";
import ListCustomers from "./list-customers";

export const metadata: Metadata = {
  title: "Percakapan | Unitip",
};

export default function Page() {
  return (
    <>
      <div>
        <div className="px-4 pt-4">
          <p className="text-lg font-semibold">Percakapan</p>
          <p className="text-muted-foreground text-sm">
            Berikut daftar beberapa percakapan antara Anda dan driver yang
            sedang berlangsung. Percakapan ini bersifat pribadi dan akan dihapus
            ketika orderan telah selesai.
          </p>
        </div>

        <div className="mt-4">
          <ListCustomers />
        </div>
      </div>
    </>
  );
}
