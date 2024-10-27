// src/app/(customer-driver)/jobs/components/OpenJobList.tsx

import { DriverOffersRecord } from "@/lib/database/xata";
import { OpenJobCard } from "./OpenJobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { OpenJobCardWrapper } from "./OpenJobCardWrapper";
import PostSkeleton from "../JobSkeleton";

interface OpenJobListProps {
  jobs: DriverOffersRecord[];
}


export default function OpenJobList({ jobs }: OpenJobListProps) {
  return (
    <div className="w-full space-y-4">
      {jobs.map((job) => (
        <Suspense key={job.id} fallback={<PostSkeleton />}>
          <OpenJobCardWrapper key={job.id} job={job} />
        </Suspense>
      ))}
    </div>
  );
}
