// src/app/(customer-driver)/jobs/ClientJobsPage.tsx
'use client';

import { useState } from "react";
import FloatingActionButton from "@/components/floating-action-button";

export default function ClientJobsPage({ children }: { children: React.ReactNode }) {
  const [showCustomerPostModal, setShowCustomerPostModal] = useState(false);
  const [showOpenJobModal, setShowOpenJobModal] = useState(false);

  const handleCreateCustomerPost = () => {
    setShowCustomerPostModal(true);
  };

  const handleCreateOpenJob = () => {
    setShowOpenJobModal(true);
  };

  return (
    <>
      {children}
      <FloatingActionButton
        onCreateCustomerPost={handleCreateCustomerPost}
        onCreateOpenJob={handleCreateOpenJob}
      />

      {/* Modal Customer Post */}
      {showCustomerPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2>Create Customer Post</h2>
            {/* form Customer Post  */}
            <button onClick={() => setShowCustomerPostModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal Open Job */}
      {showOpenJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2>Create Open Job</h2>
            {/* form Open Job */}
            <button onClick={() => setShowOpenJobModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}