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
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "./actions";

export default function ButtonLogout() {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => router.refresh(),
  });

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
        <AlertDialogTrigger asChild>
          <Button className="w-full justify-start" variant={"ghost"}>
            <LogOut className="w-4 h-4" />
            Keluar dari akun
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutate()}>
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
