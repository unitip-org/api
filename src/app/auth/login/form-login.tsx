"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser } from "./actions";

const formSchema = z.object({
  email: z
    .string({ required_error: "Alamat email tidak boleh kosong!" })
    .email("Alamat email tidak valid!"),
  password: z
    .string({ required_error: "Kata sandi tidak boleh kosong!" })
    .min(6, "Kata sandi minimal 6 karakter!"),
});

export default function FormLogin() {
  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const [error, result] = data;
      if (error) {
        console.log(error);
        return;
      }
      console.log("Login berhasil!");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "email@example.com",
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
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Masukkan beberapa informasi berikut untuk masuk ke Unitip.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-2">
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            disabled={isPendingLogin}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isPendingLogin && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
