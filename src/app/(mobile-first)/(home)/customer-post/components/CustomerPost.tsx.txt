// src\app\(mobile-first)\(home)\jobs\components\CustomerPost.tsx
"use client";

import { getCustomerPosts } from "../action";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import PostSkeleton from "./PostSkeleton";
import { Badge } from "@/components/ui/badge";
import ApplyJobModal from "./ApplyJobModal";

interface CustomerPostProps {
  isAuthenticated: boolean;
}

export default function CustomerPost({ isAuthenticated }: CustomerPostProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: posts, isLoading, error} = useQuery({
    queryKey: ["customerPosts"],
    queryFn: async () => {
      try {
        const data = await getCustomerPosts();
        return data;
      } catch (error) {
        console.error("Error fetching customer posts:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
  });
  // console.log("posts", posts);

  const handleApplyClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPostId(undefined);
    setIsModalOpen(false);
  };

  // const handleSubmitApplication = async (applicationData: any) => {
  //   try {
  //     // Add your API call here to submit the application
  //     // Example:
  //     // await submitApplication(applicationData);
  //     console.log('Submitting application:', applicationData);
  //   } catch (error) {
  //     throw new Error('Failed to submit application');
  //   }
  // };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <>
      <div className="w-full space-y-8 my-16">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="border border-border rounded-lg overflow-visible relative"
          >
            <div className="absolute -top-3 left-4 z-20">
              <span className="px-3 py-1 font-semibold text-primary-foreground bg-primary rounded-full shadow-sm capitalize">
                {post.type}
              </span>
            </div>
            <Card className="bg-card text-card-foreground shadow-sm">
              <CardHeader className="p-0">
                <div className="flex justify-between items-center border-b px-4 pb-3 pt-5 bg-muted/40">
                  <div>
                    <h2 className="text-lg font-semibold text-primary capitalize">
                      {hashCustomerName(post.user_name)}
                    </h2>
                  </div>
                  <Badge className="w-fit" variant={"outline"}>
                    {post.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Lokasi Jemput:
                    </span>{" "}
                    <span className="text-foreground">
                      {post.pickupLocation}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Tujuan:
                    </span>{" "}
                    <span className="text-foreground">
                      {post.dropoffLocation}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Preferred Gender:
                    </span>{" "}
                    <span className="text-foreground">
                      {post.preferredGender}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-foreground">
                      {formatDate(post.pickupTime)}
                    </span>
                  </p>
                </div>

                <Separator className="w-full" />

                <p className="text-sm">
                  <span className="font-medium text-muted-foreground">
                    Catatan:
                  </span>{" "}
                  <span className="text-foreground">
                    {post.additionalNotes}
                  </span>
                </p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-muted-foreground hover:text-foreground">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>{post.applicant_count} applicants</span>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleApplyClick(post.id)}
                    disabled={post.status !== 'open'}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Apply</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        postId={selectedPostId}
        isAuthenticated={isAuthenticated}
        // onSubmit={handleSubmitApplication}
      />
    </>
  );
}