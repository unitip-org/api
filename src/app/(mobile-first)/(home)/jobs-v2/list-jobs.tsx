"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import { FormattedDate, FormattedNumber } from "react-intl";
import { getAllOffers } from "./actions";

export default function ListJobs() {
  const { data: dataOffers, isLoading: isLoadingOffers } = useQuery({
    queryKey: ["getAllOffers"],
    queryFn: () => getAllOffers(),
  });

  return (
    <>
      {/* loading state */}
      {isLoadingOffers && <p>Loading...</p>}

      {/* success state */}
      {!isLoadingOffers && dataOffers && (
        <div className="flex flex-col gap-2">
          {dataOffers.map((offer, index) => (
            <Card key={"cardItem-" + index} className="overflow-hidden">
              <CardHeader className="p-0">
                <div>
                  <div className="flex justify-between items-center border-b px-4 py-3 bg-muted/40">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 text-xs">
                        <AvatarFallback>Un</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{offer.driver_name}</p>
                    </div>
                    <Badge className="w-fit" variant={"outline"}>
                      Sampai <FormattedDate value={offer.availableUntil} />
                    </Badge>
                  </div>
                  <div className="p-4">
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    <CardDescription>{offer.additionalNotes}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <div className="grid grid-cols-12 text-sm text-muted-foreground gap-y-1">
                  <p className="col-span-2 font-semibold">Biaya</p>
                  <p className="col-span-10">
                    <FormattedNumber value={offer.fee} />
                  </p>
                  <p className="col-span-2 font-semibold">Lokasi</p>
                  <p className="col-span-10">{offer.location}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 justify-between gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <UsersIcon className="size-3" />
                  <p>
                    <FormattedNumber value={12} /> mengikuti
                  </p>
                </div>
                <Button>Ikut penawaran</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
