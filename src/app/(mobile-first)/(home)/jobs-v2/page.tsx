import { Button } from "@/components/ui/button";
import ListJobs from "./list-jobs";
import { Plus } from "lucide-react";
import { verifyAuthToken } from "@/lib/auth-token";
import { cn } from "@/lib/utils";

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
          )}>
          <ListJobs />
        </div>

        {isAuthenticated && role === "driver" && (
          <Button
            className="fixed z-30 bottom-24 right-4 rounded-full size-14"
            size={"icon"}>
            <Plus />
          </Button>
        )}
      </div>
    </>
  );
}
