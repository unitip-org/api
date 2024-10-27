// client karena untuk mengakses database applicant count ke client
'use client';

import { useState, useEffect } from 'react';
import { CustomerPostCard } from './CustomerPostCard';
import { CustomerRequestsRecord } from '@/lib/database/xata';
import { getApplicantCountCustomerPost } from '../../action';

interface CustomerPostCardWrapperProps {
  post: CustomerRequestsRecord;
}

export const CustomerPostCardWrapper: React.FC<CustomerPostCardWrapperProps> = ({ post }) => {
  const [applicantCount, setApplicantCount] = useState(0);

  useEffect(() => {
    const fetchApplicantCount = async () => {
      const count = await getApplicantCountCustomerPost(post.id);
      setApplicantCount(count);
    };

    fetchApplicantCount();
  }, [post.id]);

  return <CustomerPostCard post={post} applicantCount={applicantCount} />;
};