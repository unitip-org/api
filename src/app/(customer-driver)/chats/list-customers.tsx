"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllCustomers } from "./actions";

export default function ListCustomers() {
  const { data: dataCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["getAllCustomers"],
    queryFn: () => getAllCustomers(),
  });

  return (
    <>
      {/* loading state */}
      {isLoadingCustomers && (
        <div>
          <p>Loading customers...</p>
        </div>
      )}

      {/* success state */}
      {!isLoadingCustomers && dataCustomers && (
        <div>
          {dataCustomers.map((customer, index) => (
            <Link href={"/chats/" + customer.id} key={"customerItem-" + index}>
              <div
                className={cn(
                  "flex items-center gap-4 px-4 py-3 hover:bg-muted rounded duration-300",
                  index === 0 || "border-t"
                )}
              >
                {/* avatar */}
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {/* content */}
                <div className="flex-1">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>

                {/* date */}
                <p className="text-xs text-muted-foreground">10.10</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
