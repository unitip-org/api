"use server";

import { database } from "@/lib/database";
import {
  DatabaseSchema,
  CustomerRequestsRecord,
  DriverOffersRecord,
  getXataClient,
} from "@/lib/database/xata";

import { Insertable, Updateable } from "kysely";

export type CustomerRequestInsertable = Insertable<DatabaseSchema["customer_requests"]>;
export type DriverOfferInsertable = Insertable<DatabaseSchema["driver_offers"]>;
export type CustomerRequestUpdateable = Updateable<DatabaseSchema["customer_requests"]>;
export type DriverOfferUpdateable = Updateable<DatabaseSchema["driver_offers"]>;

export async function getCustomerPosts(): Promise<CustomerRequestsRecord[]> {
  try {
    const posts = await database
      .selectFrom("customer_requests")
      .selectAll()
      // .where("status", "=", "open")
      .execute();
    return posts;
  } catch (error) {
    console.error("Error fetching customer posts:", error);
    return [];
  }
}

export async function getOpenJobs(): Promise<DriverOffersRecord[]> {
  try {
    const jobs = await database
      .selectFrom("driver_offers")
      .selectAll()
      // .where("status", "=", "open")
      .execute();
    return jobs;
  } catch (error) {
    console.error("Error fetching open jobs:", error);
    return [];
  }
}

export async function getApplicantCountCustomerPost(postId: string): Promise<number> {
  const xata = getXataClient();
  const applications = await xata.db.job_applications
    .filter({ customerRequestId: postId })
    .getMany();
  return applications.length;
}

export async function getApplicantCountOpenJob(jobId: string): Promise<number> {
  const xata = getXataClient();
  const applications = await xata.db.job_applications
    .filter({ driverOfferId: jobId })
    .getMany();
  return applications.length;
}

export async function createCustomerPost( data: CustomerRequestInsertable
): Promise<CustomerRequestsRecord | null> {
  try {
    const [newPost] = await database
      .insertInto("customer_requests")
      .values(data as any)
      .returningAll()
      .execute();
    return newPost;
  } catch (error) {
    console.error("Error creating customer post:", error);
    return null;
  }
}

export async function createOpenDriverOffer(data: DriverOfferInsertable
): Promise<DriverOffersRecord | null> {
    try {
      const [newJob] = await database
        .insertInto("driver_offers")
        .values(data as any) 
        .returningAll()
        .execute();
      return newJob;
    } catch (error) {
      console.error("Error creating open job:", error);
      return null;
    }
  }
  
  export async function updateCustomerPost(
    id: string,data: CustomerRequestUpdateable
  ): Promise<CustomerRequestsRecord | null> {
    try {
      const [updatedPost] = await database
        .updateTable("customer_requests")
        .set(data as any)
        .where("id", "=", id)
        .returningAll()
        .execute();
      return updatedPost;
    } catch (error) {
      console.error("Error updating customer post:", error);
      return null;
    }
  }
  
  export async function updateOpenJob(
    id: string,
    data: DriverOfferUpdateable
  ): Promise<DriverOffersRecord | null> {
    try {
      const [updatedJob] = await database
        .updateTable("driver_offers")
        .set(data as any) 
        .where("id", "=", id)
        .returningAll()
        .execute();
      return updatedJob;
    } catch (error) {
      console.error("Error updating open job:", error);
      return null;
    }
  }