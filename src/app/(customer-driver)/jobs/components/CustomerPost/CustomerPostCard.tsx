// server components
// src\app\(customer-driver)\jobs\components\CustomerPost\CustomerPostCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomerRequestsRecord } from "@/lib/database/xata";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApplicantCountCustomerPost } from "../../action";

interface CustomerPostCardProps {
  post: CustomerRequestsRecord;
}

export const CustomerPostCard: React.FC<CustomerPostCardProps> = ({ post }) => {
  const { data: applicantCount = 0 } = useQuery({
    queryKey: ['applicantCount', post.id],
    queryFn: () => getApplicantCountCustomerPost(post.id),
  });
  
  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="border border-indigo-200 rounded-lg overflow-visible relative my-8">
      <div className="absolute -top-3 left-4 z-20">
        <span className="px-3 py-1 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-sm">
          {post.type}
        </span>
      </div>
      <Card className="bg-white shadow-sm relative z-10 pt-4">
        <CardHeader className="flex flex-row justify-between items-center py-2">
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              {hashCustomerName(post.customerId?.name || "")}
            </h2>
          </div>
          <p className="text-sm font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700">
            {post.status}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-medium text-indigo-600">From:</span>{" "}
              {post.pickupLocation}
            </p>
            <p>
              <span className="font-medium text-indigo-600">To:</span>{" "}
              {post.dropoffLocation}
            </p>
            <p>
              <span className="font-medium text-indigo-600">Gender:</span>{" "}
              {post.preferredGender}
            </p>
            <p>
              <span className="font-medium text-indigo-600">Note:</span>{" "}
              {post.additionalNotes}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              <span>Apply</span>
            </Button>
            <div className="flex items-center justify-end hover:bg-gray-200 p-2 rounded-lg hover:outline-none">
              <span className="text-indigo-600 hover:text-indigo-700 flex items-center mr-2 hover:underline">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>{applicantCount} applicants</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
