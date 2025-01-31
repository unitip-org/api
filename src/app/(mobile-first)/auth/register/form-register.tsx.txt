"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerCustomer } from "./actions";

const formSchema = z.object({
  name: z
    .string({ required_error: "Nama tidak boleh kosong!" })
    .min(1, "Nama tidak boleh kosong!"),
  email: z
    .string({ required_error: "Alamat email tidak boleh kosong!" })
    .email("Alamat email tidak valid!"),
  password: z
    .string({ required_error: "Kata sandi tidak boleh kosong!" })
    .min(6, "Kata sandi minimal 6 karakter!"),
});

export default function FormRegister() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: registerCustomer,
    onSuccess: (result) => {
      const [error, data] = result;
      if (error) console.log(error);
      if (data === true) router.replace("/");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Rizal Dwi Anggoro",
      email: "rizaldwianggoro@unitip.com",
      password: "password",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Nama lengkap</FormLabel>
                <FormControl>
                  <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="mt-4"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Register
          </Button>
        </form>
      </Form>
    </>
  );
}
