// src\app\(customer-driver)\jobs\components\JobTabs.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CustomerRequestsRecord, DriverOffersRecord } from "@/lib/database/xata";
import CustomerPostList from './CustomerPost/CustomerPostList';
import OpenJobList from './OpenJob/OpenJobList';

interface JobTabsProps {
  initialCustomerPosts: CustomerRequestsRecord[];
  initialOpenJobs: DriverOffersRecord[];
}

export default function JobTabs({ initialCustomerPosts, initialOpenJobs }: JobTabsProps) {
  const [customerPosts] = useState(initialCustomerPosts);
  const [openJobs] = useState(initialOpenJobs);

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
        <CustomerPostList posts={customerPosts} />
      </TabsContent>

      <TabsContent value="open">
        <OpenJobList jobs={openJobs} />
      </TabsContent>
    </Tabs>
  );
}