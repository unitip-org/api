"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { logoutCustomer } from "./actions";

export default function AlertLogout() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { mutate, isPending } = useMutation({
    mutationFn: logoutCustomer,
  });

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"}>
            <LogOutIcon />
            Keluar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin akan keluar dari akun ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => mutate()} disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Keluar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
