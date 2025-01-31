// src/app/(customer-driver)/jobs/page.tsx
import { verifyAuthToken } from "@/lib/auth-token";
import ClientJobsPage from "./client-layout-jobs-page";
import CustomerPost from "./components/CustomerPost";

export default async function CustomerPostPage() {
  let isAuthenticated = false;
  try {
    const data = await verifyAuthToken();
    // console.log("User data: ", data);
    isAuthenticated = true;
  } catch (error) {
    console.error("Authentication failed: ", error);
  }
  
  // const data = await verifyAuthToken();
  // console.log("User data: ", data);

  return (
    <div className="h-[calc(100vh-9rem)] overflow-y-auto my-16">
      <ClientJobsPage isAuthenticated={isAuthenticated} >
        <div className="container max-w-3xl mx-auto p-4">
          <CustomerPost isAuthenticated={isAuthenticated} />
        </div>
      </ClientJobsPage>
    </div>
  );
}
// async function JobsContent() {
//   const customerPosts = await getCustomerPosts();
//   const openJobs = await getOpenJobs();

//   return (
//     <JobTabs initialCustomerPosts={customerPosts} initialOpenJobs={openJobs} />
//   );
// }

// function LoadingSpinner() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Spinner size="large" />
//     </div>
//   );
// }
