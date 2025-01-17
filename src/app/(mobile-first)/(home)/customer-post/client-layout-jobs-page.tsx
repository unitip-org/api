// src/app/(mobile-first)/(home)/customer-post/client-layout-jobs-page.tsx
"use client";

import { useState } from "react";
import FloatingActionButton from "@/components/floating-action-button";
import { CustomerPostForm } from "./components/CustomerPostForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserPlus, Briefcase, X } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const queryClient = new QueryClient();

interface ClientJobsPageProps {
  isAuthenticated: boolean;
  children?: React.ReactNode;
}

export default function ClientJobsPage({
  isAuthenticated,
  children,
}: ClientJobsPageProps) {
  const [showCustomerPostModal, setShowCustomerPostModal] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const handleCreateCustomerPost = () => {
    if (isAuthenticated) {
      setShowCustomerPostModal(true);
    } else {
      setShowAuthAlert(true);
    }
  };

  const fabActions = [
    {
      icon: <UserPlus size={24} />,
      label: "Customer Post",
      onClick: handleCreateCustomerPost,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <FloatingActionButton actions={fabActions} />

      <Dialog
        open={showCustomerPostModal}
        onOpenChange={setShowCustomerPostModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Customer Post</DialogTitle>
            <DialogDescription>
              Please fill out the form below to create a new customer post
            </DialogDescription>
          </DialogHeader>
          <CustomerPostForm onClose={() => setShowCustomerPostModal(false)} />
        </DialogContent>
      </Dialog>

      {showAuthAlert && (
        <div className="fixed bg-background top-16 left-0 right-0 z-50 flex justify-center p-4">
          <Alert
            variant="destructive"
            className="max-w-[512px] w-full relative"
          >
            <AlertTitle> Authentication Required </AlertTitle>
            <Separator />
            <AlertDescription className="mt-1">
              Anda harus login terlebih dahulu untuk membuat customer post.
              <Link href="/auth/login">
                <Button variant="outline" className="mt-2">
                  Go to Login
                </Button>
              </Link>
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowAuthAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </div>
      )}
    </QueryClientProvider>
  );
}
