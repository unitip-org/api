// src\app\(mobile-first)\(home)\jobs\action.ts
"use server";

import { database } from "@/lib/database";
import {
  DatabaseSchema,
  CustomerRequestsRecord,
  DriverOffersRecord,
  getXataClient,
} from "@/lib/database/xata";
import { verifyAuthToken } from "@/lib/auth-token";

interface CustomerRequest {
  id?: string; 
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  additionalNotes?: string;
  preferredGender: "male" | "female" | "any";
  type: string;
  status: string;
}

export async function getCustomerPosts() {
  try {
    const posts = await database
      .selectFrom("customer_requests as cr")
      .innerJoin("users", "users.id", "cr.customerId")
      .select([
        "cr.id",
        "cr.pickupLocation",
        "cr.dropoffLocation",
        "cr.additionalNotes",
        "cr.type",
        "cr.status",
        "cr.preferredGender",
        "cr.pickupTime",
        "users.id as user_id",
        "users.name as user_name",
        (eb) =>
          eb
            .selectFrom("job_applications as ja")
            .select(eb.fn.count("id").as("applicant_count"))
            .whereRef("customerRequestId", "=", "cr.id")
            .as("applicant_count"),
      ])
      .execute();

    return posts;
  } catch (error) {
    console.error("Error fetching customer posts", error);
    throw error;
  }
}

export async function createCustomerPost(data: Omit<CustomerRequest, 'id' | 'pickupTime'> & { pickupTime: string }) {
  try {
    const insertData: Omit<CustomerRequest, 'id'> = {
      ...data,
      pickupTime: new Date(data.pickupTime),
    };

    const [newPost] = await database
      .insertInto("customer_requests")
      .values(insertData as any)
      .returningAll()
      .execute();

    return {
      id: newPost.id,
      pickupLocation: newPost.pickupLocation,
      dropoffLocation: newPost.dropoffLocation,
      pickupTime: newPost.pickupTime instanceof Date ? newPost.pickupTime.toISOString() : newPost.pickupTime,
      additionalNotes: newPost.additionalNotes,
      preferredGender: newPost.preferredGender,
      type: newPost.type,
      status: newPost.status,
    };
  } catch (error) {
    console.error("Error creating customer post:", error);
    return null;
  }
}


export async function updateCustomerPost(
  id: string,
  data: Partial<CustomerRequest>
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

export const getAllJobs = async () => {
  try {
    const query = database
      .selectFrom("customer_requests as cr")
      .leftJoin("job_applications as ja", "cr.id", "ja.customerRequestId")
      .select(["cr.id"])
      .select((eb) => eb.fn.count("ja.id").as("applicant_count"))
      .groupBy("cr.id");

    // console.log(query.compile());
    const result = await query.execute();
    // console.log(result);

    return result;
  } catch (e) {
    throw e;
  }
};

// fungsi lainnya

type ApplicationData = {
  customerRequestId: string;
  // applicantId: string;
  fee: number;
};

export async function createCustomerRequestApplication(data: ApplicationData) {
  try {
    const userData = await verifyAuthToken();

    if (!userData || !userData.id) {
      throw new Error("Failed to retrieve user information");
    }

    const newApplication = await database
      .insertInto("customer_request_applications")
      .values({
        applicant: userData.id,
        customer_requests: data.customerRequestId,
        fee: data.fee,
        status: "pending"
      } as any)
      .returningAll()
      .executeTakeFirst();

    return newApplication;
  } catch (error) {
    console.error("Error creating job application:", error);
    throw new Error("Failed to submit application");
  }
}
// export async function getOpenJobs() {
//   try {
//     const jobs = await database
//       .selectFrom("driver_offers")
//       .innerJoin("users", "users.id", "driver_offers.driverId")
//       .select([
//         "driver_offers.id",
//         "driver_offers.title",
//         "driver_offers.location",
//         "driver_offers.fee",
//         "driver_offers.availableUntil",
//         "driver_offers.additionalNotes",
//         "driver_offers.type",
//         "driver_offers.status",
//         "users.id as driver_id",
//         "users.name as driver_name",
//       ])
//       .execute();
//     return jobs;
//   } catch (error) {
//     console.error("Error fetching open jobs:", error);
//     return [];
//   }
// }

// export async function createOpenDriverOffer(
//   data: DriverOfferInsertable
// ): Promise<DriverOffersRecord | null> {
//   try {
//     const [newJob] = await database
//       .insertInto("driver_offers")
//       .values(data as any)
//       .returningAll()
//       .execute();
//     return newJob;
//   } catch (error) {
//     console.error("Error creating open job:", error);
//     return null;
//   }
// }


// export async function updateOpenJob(
//   id: string,
//   data: DriverOfferUpdateable
// ): Promise<DriverOffersRecord | null> {
//   try {
//     const [updatedJob] = await database
//       .updateTable("driver_offers")
//       .set(data as any)
//       .where("id", "=", id)
//       .returningAll()
//       .execute();
//     return updatedJob;
//   } catch (error) {
//     console.error("Error updating open job:", error);
//     return null;
//   }
// }
