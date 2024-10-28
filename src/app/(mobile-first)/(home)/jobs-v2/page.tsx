import ListJobs from "./list-jobs";

export default function Page() {
  return (
    <>
      <div className="pt-20 px-4">
        <p className="text-lg font-semibold">Jobs</p>
        <p className="text-muted-foreground text-sm">
          Berikut beberapa jobs yang ditawarkan oleh mitra atau driver.
        </p>

        <div className="mt-4">
          <ListJobs />
        </div>
      </div>
    </>
  );
}
