// src/app/(customer-driver)/jobs/client-layout-jobs-page.tsx
"use client";

import { useState } from "react";
import FloatingActionButton from "@/components/floating-action-button";
import { CustomerPostForm } from "./components/CustomerPostForm";
import { OpenJobForm } from "./components/OpenJobForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function ClientJobsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCustomerPostModal, setShowCustomerPostModal] = useState(false);
  const [showOpenJobModal, setShowOpenJobModal] = useState(false);

  const handleCreateCustomerPost = () => {
    setShowCustomerPostModal(true);
  };

  const handleCreateOpenJob = () => {
    setShowOpenJobModal(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <FloatingActionButton
        onCreateCustomerPost={handleCreateCustomerPost}
        onCreateOpenJob={handleCreateOpenJob}
      />

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

      <Dialog open={showOpenJobModal} onOpenChange={setShowOpenJobModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Open Job</DialogTitle>
            <DialogDescription>
              Please fill out the form below to create a new open job
            </DialogDescription>
          </DialogHeader>
          <OpenJobForm onClose={() => setShowOpenJobModal(false)} />
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}
