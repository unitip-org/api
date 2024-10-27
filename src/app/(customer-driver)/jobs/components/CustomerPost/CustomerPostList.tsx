// src/app/(customer-driver)/jobs/components/CustomerPostList.tsx
import { CustomerRequestsRecord } from "@/lib/database/xata";
import { CustomerPostCardWrapper } from "./CustomerPostCardWrapper";
import PostSkeleton from "../JobSkeleton";
import { Suspense } from "react";
// console.log("CustomerPostCardWrapper:", CustomerPostCardWrapper);

interface CustomerPostListProps {
  posts: CustomerRequestsRecord[];
}

export default function CustomerPostList({ posts }: CustomerPostListProps) {
  return (
    <div className="w-full space-y-4">
      {posts.map((post) => (
        <Suspense key={post.id} fallback={<PostSkeleton />}>
          <CustomerPostCardWrapper key={post.id} post={post} />
        </Suspense>
      ))}
    </div>
  );
}
