import { Button } from "@/components/ui/button";
import { verifyAuthToken } from "@/lib/auth-token";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import ListJobs from "./list-jobs";

export default async function Page() {
  let isAuthenticated = false;
  let role = "";

  try {
    const session = await verifyAuthToken();
    isAuthenticated = true;
    role = session.role;
  } catch (e) {
    isAuthenticated = false;
  }

  return (
    <>
      <div className="pt-20 px-4">
        <p className="text-lg font-semibold">Jobs</p>
        <p className="text-muted-foreground text-sm">
          Berikut beberapa jobs yang ditawarkan oleh mitra atau driver.
        </p>

        <div
          className={cn(
            "mt-4",
            isAuthenticated && role === "driver" ? "mb-[10.5rem]" : "mb-24"
          )}
        >
          <ListJobs />
        </div>

        {isAuthenticated && role === "driver" && (
          <div className="fixed z-30 bottom-24 w-full left-0 right-0 pointer-events-none">
            <div className="max-w-[512px] mx-auto flex justify-end px-4 pointer-events-none">
              <Button
                className="rounded-full size-14 pointer-events-auto"
                size={"icon"}
              >
                <Plus />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
