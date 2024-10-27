// server components
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DriverOffersRecord } from "@/lib/database/xata";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";
import { getApplicantCountOpenJob } from "../../action";
import { useQuery } from "@tanstack/react-query";

interface OpenJobCardProps {
  job: DriverOffersRecord;
}
export const OpenJobCard: React.FC<OpenJobCardProps> = ({ job }) => {
  const { data: applicantCount = 0 } = useQuery({
    queryKey: ['applicantCount', job.id],
    queryFn: () => getApplicantCountOpenJob(job.id),
  });

  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="border border-indigo-200 rounded-lg overflow-visible relative my-8">
      <div className="absolute -top-3 left-4 z-20">
        <span className="px-3 py-1 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-sm">
          {job.type}
        </span>
      </div>
      <Card className="bg-white shadow-sm relative z-10 pt-4">
        <CardHeader className="flex flex-row justify-between items-center py-2">
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              {hashCustomerName(job.driverId?.name || "")}
            </h2>
          </div>
          <p className="text-sm font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700">
            sampai{" "}
            {job.availableUntil
              ? new Date(job.availableUntil).toLocaleDateString()
              : "Tanggal tidak tersedia"}
          </p>
        </CardHeader>
        <CardContent className="pb-4">
          <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <p>
              <span className="font-medium text-indigo-600">Fee:</span>{" "}
              {job.fee}
            </p>
            <p>
              <span className="font-medium text-indigo-600">Location:</span>{" "}
              {job.location}
            </p>
            <p>
              <span className="font-medium text-indigo-600">Note:</span>{" "}
              {job.additionalNotes}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 hover:bg-indigo-50"
              >
                <MessageSquare className="w-4 h-4 " />
                <span>Chat</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <span>Apply</span>
              </Button>
            </div>
            <div className="flex items-center text-indigo-600">
              <User className="w-4 h-4 mr-2" />
              <span>{applicantCount} applicant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
