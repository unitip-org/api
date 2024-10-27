// src/app/(customer-driver)/jobs/page.tsx
import JobTabs from './components/JobTabs';
import ClientJobsPage from './client-layout-jobs-page';

// async function JobsContent() {
//   const customerPosts = await getCustomerPosts();
//   const openJobs = await getOpenJobs();

//   return (
//     <JobTabs initialCustomerPosts={customerPosts} initialOpenJobs={openJobs} />
//   );
// }

export default function JobsPage() {
  return (
    <ClientJobsPage>
      <div className="container max-w-3xl mx-auto p-4">
          <JobTabs />
      </div>
    </ClientJobsPage>
  );
}

// function LoadingSpinner() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Spinner size="large" />
//     </div>
//   );
// }
