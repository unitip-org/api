"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthTokenType } from "@/lib/auth-token";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { commitRole, login } from "./actions";

const formSchema = z.object({
  email: z
    .string({ required_error: "Alamat email tidak boleh kosong!" })
    .email("Alamat email tidak valid!"),
  password: z
    .string({ required_error: "Kata sandi tidak boleh kosong!" })
    .min(6, "Kata sandi minimal 6 karakter!"),
});

export default function FormLogin() {
  const router = useRouter();

  const [roles, setRoles] = useState<AuthTokenType[]>([]);

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.length > 0) setRoles(data);
      else router.replace("/");
      // const [error, result] = data;
      // if (error) {
      //   console.log(error);
      //   return;
      // }
      // if (result) router.replace("/");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate: mutateCommit, isPending: isPendingCommit } = useMutation({
    mutationFn: commitRole,
    onSuccess: () => {
      console.log("success");
      router.replace("/");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "rizaldwianggoro@unitip.com",
      password: "password",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Alamat email</FormLabel>
                  <FormControl>
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Kata sandi</FormLabel>
                  <FormControl>
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isPendingLogin}
            type="submit"
            className="w-full mt-4"
          >
            {isPendingLogin && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk
          </Button>
        </form>
      </Form>

      {/* dialog select role */}
      <Dialog
        open={roles.length > 0}
        onOpenChange={(e) => {
          if (!e) setRoles([]);
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Role</DialogTitle>
            <DialogDescription>
              Anda ingin masuk ke Unitip sebagai role apa? Silahkan pilih salah
              satu dari role berikut.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[32vh]">
            <div className="flex flex-col gap-1">
              {roles.map((role, index) => (
                <Button
                  key={"roleItem-" + index}
                  variant={"outline"}
                  onClick={() => mutateCommit({ ...role })}
                >
                  {role.role}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* <DialogFooter>
            <Button variant={"outline"}>Batal</Button>
            <Button>Lanjut</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
