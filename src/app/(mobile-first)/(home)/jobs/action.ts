// src\app\(mobile-first)\(home)\jobs\action.ts
"use server";

import { database } from "@/lib/database";
import {
  DatabaseSchema,
  CustomerRequestsRecord,
  DriverOffersRecord,
  getXataClient,
} from "@/lib/database/xata";

import { Insertable, sql, Updateable } from "kysely";

export type CustomerRequestInsertable = Insertable<
  DatabaseSchema["customer_requests"]
>;
export type DriverOfferInsertable = Insertable<DatabaseSchema["driver_offers"]>;
export type CustomerRequestUpdateable = Updateable<
  DatabaseSchema["customer_requests"]
>;
export type DriverOfferUpdateable = Updateable<DatabaseSchema["driver_offers"]>;

// export async function getCustomerPosts(): Promise<CustomerRequestsRecord[]> {
//   try {
//     const posts = await database
//       .selectFrom("customer_requests")
//       .leftJoin("users", "users.id", "customer_requests.customerId")
//       .select((eb) => [
//         "customer_requests.id",
//         "customer_requests.title",
//         "customer_requests.pickupLocation",
//         "customer_requests.dropoffLocation",
//         "customer_requests.additionalNotes",
//         "customer_requests.type",
//         "customer_requests.status",
//         "customer_requests.preferredGender",
//         "customer_requests.pickupTime",
//         sql`json_build_object(
//           'id', ${eb.ref("users.id")},
//           'name', ${eb.ref("users.name")}
//         )`.as("customerId")
//       ])
//       .execute();

//     console.log("Raw query result:", posts);
//     return posts as any;
//   } catch (error) {
//     console.error("Error fetching customer posts:", error);
//     return [];
//   }
// }

export async function getCustomerPosts(): Promise<CustomerRequestsRecord[]> {
  try {
    const posts = await database
      .selectFrom("customer_requests")
      .leftJoin(
        database.selectFrom("users").select(["id", "name"]).as("user"),
        "user.id",
        "customer_requests.customerId"
      )
      .select([
        "customer_requests.id",
        "customer_requests.title",
        "customer_requests.pickupLocation",
        "customer_requests.dropoffLocation",
        "customer_requests.additionalNotes",
        "customer_requests.type",
        "customer_requests.status",
        "customer_requests.preferredGender",
        "customer_requests.pickupTime",
        "user.id as customerId",
        "user.name as customerName",
      ])
      .execute();

    // Transform hasil query agar customerId.
    const transformedPosts = posts.map((post) => ({
      ...post,
      customerId: post.customerId
        ? { id: post.customerId, name: post.customerName }
        : null,
    }));

    console.log("Transformed query result:", transformedPosts);
    return transformedPosts as any;
  } catch (error) {
    console.error("Error fetching customer posts:", error);
    return [];
  }
}

export async function getOpenJobs(): Promise<DriverOffersRecord[]> {
  try {
    const jobs = await database
      .selectFrom("driver_offers")
      .leftJoin(
        database.selectFrom("users").select(["id", "name"]).as("user"),
        "user.id",
        "driver_offers.driverId"
      )
      .select([
        "driver_offers.id",
        "driver_offers.title",
        "driver_offers.location",
        "driver_offers.fee",
        "driver_offers.availableUntil",
        "driver_offers.additionalNotes",
        "driver_offers.type",
        "driver_offers.status",
        "user.id as driverId",
        "user.name as driverName",
      ])
      .execute();

    // Transform hasil query agar driverId.
    const transformedJobs = jobs.map((job) => ({
      ...job,
      driverId: job.driverId
        ? { id: job.driverId, name: job.driverName }
        : null,
    }));

    console.log("Transformed query result:", transformedJobs);
    return transformedJobs as any;
  } catch (error) {
    console.error("Error fetching open jobs:", error);
    return [];
  }
}

// export async function getOpenJobs(): Promise<DriverOffersRecord[]> {
//   try {
//     const jobs = await database
//       .selectFrom("driver_offers")
//       .selectAll()
//       // .where("status", "=", "open")
//       .execute();
//     return jobs;
//   } catch (error) {
//     console.error("Error fetching open jobs:", error);
//     return [];
//   }
// }

export async function getApplicantCountCustomerPost(
  postId: string
): Promise<number> {
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

export async function createCustomerPost(
  data: CustomerRequestInsertable
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

export async function createOpenDriverOffer(
  data: DriverOfferInsertable
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
  id: string,
  data: CustomerRequestUpdateable
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
