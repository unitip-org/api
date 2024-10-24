import FormLogin from "./form-login";

export default function Page() {
  return (
    <>
      <div className="py-8">
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
      </div>
    </>
  );
}
