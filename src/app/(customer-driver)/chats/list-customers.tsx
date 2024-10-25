"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon } from "lucide-react";
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
        <div className="space-y-2 mx-4">
          {dataCustomers.map((customer, index) => (
            <Card key={"customerItem-" + index}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <CardDescription>{customer.email}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-end p-4 pt-0">
                <Button asChild>
                  <Link href={"/chats/" + customer.id}>
                    <MessageCircleIcon className="w-4 h-4" />
                    Chat
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
