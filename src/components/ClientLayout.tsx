// src\components\ClientLayout.tsx
'use client';

import { useState } from "react";
import BottomNavigation from "./bottom-navigation-bar";
import FloatingActionButton from "./floating-action-button";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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
      <div className="h-[calc(100vh-9rem)] overflow-y-auto my-16">
        {children}
      </div>
      <FloatingActionButton
        onCreateCustomerPost={handleCreateCustomerPost}
        onCreateOpenJob={handleCreateOpenJob}
      />
      <BottomNavigation />

      {/* Modal untuk Customer Post */}
      {showCustomerPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2>Create Customer Post</h2>
            {/* form Customer Post  */}
            <button onClick={() => setShowCustomerPostModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal untuk Open Job */}
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