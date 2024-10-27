// src/app/(customer-driver)/jobs/components/OpenJobList.tsx
import { DriverOffersRecord } from "@/lib/database/xata";
import { OpenJobCard } from "./OpenJobCard";

interface OpenJobListProps {
  jobs: DriverOffersRecord[];
}

export default function OpenJobList({ jobs }: OpenJobListProps) {
  return (
    <div className="w-full space-y-4">
      {jobs.map((job) => (
        <OpenJobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
