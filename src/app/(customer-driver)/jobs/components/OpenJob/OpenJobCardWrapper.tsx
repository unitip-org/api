// client karena untuk mengakses database applicant count ke client
'use client';

import { useState, useEffect } from 'react';
import { OpenJobCard } from './OpenJobCard';
import { DriverOffersRecord } from '@/lib/database/xata';
import { getApplicantCountOpenJob } from '../../action';

interface OpenJobCardWrapperProps {
  job: DriverOffersRecord;
}

export const OpenJobCardWrapper: React.FC<OpenJobCardWrapperProps> = ({ job }) => {
  const [applicantCount, setApplicantCount] = useState(0);

  useEffect(() => {
    const fetchApplicantCount = async () => {
      const count = await getApplicantCountOpenJob(job.id);
      setApplicantCount(count);
    };

    fetchApplicantCount();
  }, [job.id]);

  return <OpenJobCard job={job} applicantCount={applicantCount} />;
};