"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, MessageCirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getAllCustomers } from "./actions";

export default function ButtonCreateChat() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["getAllCustomers"],
    queryFn: () => getAllCustomers(),
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
        <DialogTrigger asChild>
          <Button size={"icon"} variant={"outline"} className="rounded-full">
            <MessageCirclePlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Only</DialogTitle>
            <DialogDescription>
              Modal ini digunakan untuk menambahkan room chat baru, serta untuk
              tujuan test saja. Pada modal ini akan ditampilkan daftar semua
              users yang terdaftar pada database.
            </DialogDescription>
          </DialogHeader>

          {/* loading state */}
          {isLoading && (
            <div>
              <p>Loading customers...</p>
            </div>
          )}

          {/* success state */}
          {!isLoading && data && (
            <ScrollArea className="h-56">
              <div className="flex flex-col gap-2">
                {data.map((customer, index) => (
                  <div
                    key={"customerItem-" + index}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                    <Button asChild onClick={() => setIsDialogOpen(false)}>
                      <Link href={"/chats/" + customer.id}>
                        Chat
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant={"outline"} onClick={() => setIsDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
