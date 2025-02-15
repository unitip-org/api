import { OfferStatus } from "@/constants/constants";
import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
interface RecentActivity {
  user_name: string;
  activity_type: "job" | "offer";
  created_at: string;
}

interface GETResponse {
  activities: {
    censored_name: string;
    activity_type: "job" | "offer";
    time_ago: string;
  }[];
}

export const GET = async (request: NextRequest) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Pisahkan query jobs dan offers
    const jobsQuery = database
      .selectFrom("jobs as j")
      .select([
        sql<string>`u.name`.as("user_name"),
        sql<"job">`'job'`.as("activity_type"),
        sql<string>`j."xata.createdAt"`.as("created_at"),
      ])
      .innerJoin("users as u", "u.id", "j.customer")
      .where(sql`j."xata.createdAt"`, ">", oneDayAgo.toISOString());

    const offersQuery = database
      .selectFrom("offers as o")
      .select([
        sql<string>`u.name`.as("user_name"),
        sql<"offer">`'offer'`.as("activity_type"),
        sql<string>`o."xata.createdAt"`.as("created_at"),
      ])
      .innerJoin("users as u", "u.id", "o.freelancer")
      .where(sql`o."xata.createdAt"`, ">", oneDayAgo.toISOString());

    // Gabungkan hasil kedua query
    const [jobsResult, offersResult] = await Promise.all([
      jobsQuery.execute(),
      offersQuery.execute(),
    ]);

    // Gabungkan dan urutkan hasil
    const activities = [...jobsResult, ...offersResult].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Format response
    const formattedActivities = activities.map((activity: RecentActivity) => {
      const firstName = activity.user_name.split(" ")[0];
      const censoredName =
        firstName.substring(0, 2) + "*".repeat(firstName.length - 2);
      const timeAgo = getTimeAgo(new Date(activity.created_at));

      return {
        censored_name: censoredName,
        activity_type: activity.activity_type,
        time_ago: timeAgo,
      };
    });

    return APIResponse.respondWithSuccess<GETResponse>({
      activities: formattedActivities,
    });
  } catch (e) {
    return APIResponse.respondWithServerError;
  }
};

// Helper function untuk format waktu
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} jam lalu`;
  }
}
