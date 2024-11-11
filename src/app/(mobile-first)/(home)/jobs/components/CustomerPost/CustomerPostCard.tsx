// server components
// src\app\(customer-driver)\jobs\components\CustomerPost\CustomerPostCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomerRequestsRecord } from "@/lib/database/xata";
import { Clock, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApplicantCountCustomerPost } from "../../action";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CustomerPostCardProps {
  post: CustomerRequestsRecord;
}

export const CustomerPostCard: React.FC<CustomerPostCardProps> = ({ post }) => {
  const { data: applicantCount = 0 } = useQuery({
    queryKey: ["applicantCount", post.id],
    queryFn: () => getApplicantCountCustomerPost(post.id),
  });

  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="border border-border rounded-lg overflow-visible relative">
      <div className="absolute -top-3 left-4 z-20">
        <span className="px-3 py-1 font-semibold text-primary-foreground bg-primary rounded-full shadow-sm capitalize">
          {post.type}
        </span>
      </div>
      <Card className="bg-card text-card-foreground shadow-sm relative z-10 pt-4">
        <CardHeader className="py-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-primary capitalize">
                {post.customerId?.name}
              </h2>
            </div>
            <p className="text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {post.status}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-medium text-muted-foreground">
                Lokasi Jemput:
              </span>{" "}
              <span className="text-foreground">{post.pickupLocation}</span>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Tujuan:</span>{" "}
              <span className="text-foreground">{post.dropoffLocation}</span>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">
                Preferred Gender:
              </span>{" "}
              <span className="text-foreground">{post.preferredGender}</span>
            </p>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-foreground">
                {formatDate(post.pickupTime)}
              </span>
            </p>
          </div>

          {/* separator */}
          <Separator className=" w-full" />

          <p className="text-sm">
            <span className="font-medium text-muted-foreground">Catatan:</span>{" "}
            <span className="text-foreground">{post.additionalNotes}</span>
          </p>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              <span>Apply</span>
            </Button>
            <div className="flex items-center text-muted-foreground hover:text-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{applicantCount} applicants</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
