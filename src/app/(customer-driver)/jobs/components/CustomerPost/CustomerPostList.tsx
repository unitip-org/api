// src/app/(customer-driver)/jobs/components/CustomerPostList.tsx
import { CustomerRequestsRecord } from "@/lib/database/xata";
import { CustomerPostCard } from "./CustomerPostCard";

interface CustomerPostListProps {
  posts: CustomerRequestsRecord[];
}

export default function CustomerPostList({ posts }: CustomerPostListProps) {
  return (
    <div className="w-full space-y-4">
      {posts.map((post) => (
        <CustomerPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
