// src/app/(customer-driver)/jobs/components/JobSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JobSkeleton() {
  return (
    <Tabs defaultValue="customerPosts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="customerPosts">Customer Posts</TabsTrigger>
        <TabsTrigger value="openJobs">Open Jobs</TabsTrigger>
      </TabsList>
      <TabsContent value="customerPosts">
        <SkeletonContent />
      </TabsContent>
      <TabsContent value="openJobs">
        <SkeletonContent />
      </TabsContent>
    </Tabs>
  );
}

function SkeletonContent() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
          <Skeleton className="h-4 w-[70%]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
