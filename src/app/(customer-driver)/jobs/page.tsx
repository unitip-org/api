// src/app/(customer-driver)/jobs/page.tsx
import { Suspense } from 'react';
import JobTabs from './components/JobTabs';
import { getCustomerPosts, getOpenJobs } from './action';
import { Spinner } from "@/components/ui/spinner";
import JobSkeleton from './components/JobSkeleton';
import ClientJobsPage from './client-layout-jobs-page';

// function LoadingSpinner() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Spinner size="large" />
//     </div>
//   );
// }

async function JobsContent() {
  const customerPosts = await getCustomerPosts();
  const openJobs = await getOpenJobs();

  return (
    <JobTabs initialCustomerPosts={customerPosts} initialOpenJobs={openJobs} />
  );
}

export default function JobsPage() {
  return (
    <ClientJobsPage>
      <div className="container max-w-3xl mx-auto p-4">
        <Suspense fallback={<JobSkeleton />}>
          <JobsContent />
        </Suspense>
      </div>
    </ClientJobsPage>
  );
}