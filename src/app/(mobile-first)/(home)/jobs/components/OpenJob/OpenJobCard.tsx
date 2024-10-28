// server components
// src\app\(mobile-first)\(home)\jobs\components\OpenJob\OpenJobCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DriverOffersRecord } from "@/lib/database/xata";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";
import { getApplicantCountOpenJob } from "../../action";
import { cn, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

interface OpenJobCardProps {
  job: DriverOffersRecord;
}
export const OpenJobCard: React.FC<OpenJobCardProps> = ({ job }) => {
  const { data: applicantCount = 0 } = useQuery({
    queryKey: ["applicantCount", job.id],
    queryFn: () => getApplicantCountOpenJob(job.id),
  });

  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="border border-border rounded-lg overflow-visible relative">
      <div className="absolute -top-3 left-4 z-20">
        <span className="px-3 py-1 font-semibold text-primary-foreground bg-primary rounded-full shadow-sm capitalize">
          {job.type}
        </span>
      </div>
      <Card className="bg-card text-card-foreground shadow-sm relative z-10 pt-4">
        <CardHeader className="py-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-primary  capitalize">
                {job.driverId?.name}
              </h2>
              {/* <div className="w-full h-px bg-border "></div> */}
              <h3 className="text-md font-medium text-muted-foreground">
                {job.title}
              </h3>
            </div>
            <div
              className={cn(
                "text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground",
                "ml-2" 
              )}
            >
              sampai{" "}
              {formatDate(job.availableUntil)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-medium text-muted-foreground">Fee:</span>{" "}
              {job.fee}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">
                Location:
              </span>{" "}
              {job.location}
            </p>
          </div>
          {/* separator */}

          <Separator className="w-full my-2" />

          <p className="text-sm my-4">
            <span className="font-medium text-muted-foreground">Catatan:</span>{" "}
            {job.additionalNotes}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MessageSquare className="w-4 h-4 " />
                <span>Chat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <span>Apply</span>
              </Button>
            </div>
            <div className="flex items-center text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4 mr-2" />
              <span>{applicantCount} applicant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
