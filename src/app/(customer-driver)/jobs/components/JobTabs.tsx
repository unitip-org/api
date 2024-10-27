// src\app\(customer-driver)\jobs\components\JobTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import CustomerPostList from "./CustomerPost/CustomerPostList";
import OpenJobList from "./OpenJob/OpenJobList";
import { getCustomerPosts, getOpenJobs } from "../action";
import { useQuery } from "@tanstack/react-query";

import {
  CustomerRequestsRecord,
  DriverOffersRecord,
} from "@/lib/database/xata";
import JobSkeleton from "./JobSkeleton";

export default function JobTabs() {
  const customerPostsQuery = useQuery<CustomerRequestsRecord[]>({
    queryKey: ["customerPosts"],
    queryFn: async () => {
      try {
        const data = await getCustomerPosts();
        console.log("refetching customer posts");
        return data;
      } catch (error) {
        console.error("Error fetching customer posts:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
  });

  const openJobsQuery = useQuery<DriverOffersRecord[]>({
    queryKey: ["openJobs"],
    queryFn: async () => {
      try {
        const data = await getOpenJobs();
        console.log("refetching open jobs");
        return data;
      } catch (error) {
        console.error("Error fetching open jobs:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
  });

  if(customerPostsQuery.isLoading || openJobsQuery.isLoading) {
    return <JobSkeleton />;
  }

  return (
    <Tabs defaultValue="customer" className="w-full">
      <TabsList className="flex w-full mb-6 bg-indigo-100 rounded-lg p-[6px]">
        <TabsTrigger
          value="customer"
          className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
        >
          Customer Post
        </TabsTrigger>
        <TabsTrigger
          value="open"
          className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
        >
          Open Job
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customer">
        <CustomerPostList posts={customerPostsQuery.data || []} />
      </TabsContent>

      <TabsContent value="open">
        <OpenJobList jobs={openJobsQuery.data || []} />
      </TabsContent>
    </Tabs>
  );
}
