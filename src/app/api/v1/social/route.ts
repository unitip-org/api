import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
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

    // header if-modified-since
    const ifModifiedSince = request.headers.get("if-modified-since");

    const activitiesQuery = database
      .selectFrom("activities")
      .innerJoin("users", "users.id", "activities.user")
      .select([
        sql<string>`users.name`.as("user_name"),
        "activities.activity_type",
        sql<string>`activities."xata.createdAt"`.as("created_at"),
      ])
      .where(
        sql<string>`activities."xata.createdAt"`,
        ">",
        oneDayAgo.toISOString()
      )
      .orderBy("created_at", "desc");

    const activities = await activitiesQuery.execute();

    const latestTimestamp =
      activities.length > 0 ? new Date(activities[0].created_at) : new Date();

    // Jika client mengirim header if-modified-since, bandingkan dengan latestTimestamp
    if (ifModifiedSince) {
      const clientDate = new Date(ifModifiedSince);
      const clientSeconds = Math.floor(clientDate.getTime() / 1000);
      const latestSeconds = Math.floor(latestTimestamp.getTime() / 1000);

      if (latestSeconds <= clientSeconds) {
        return new Response(null, { status: 304 });
      }
    }
    // console.log("activities", activities);
    // console.log("latestTimestamp", latestTimestamp);
    // console.log("ifModifiedSince", ifModifiedSince);

    // Format response
    const formattedActivities = activities.map((activity) => {
      const firstName = (activity.user_name as any).split(" ")[0];
      const censoredName =
        firstName.substring(0, 2) + "*".repeat(firstName.length - 2);
      const timeAgo = getTimeAgo(new Date(activity.created_at));

      return {
        censored_name: censoredName,
        activity_type: activity.activity_type as "job" | "offer",
        time_ago: timeAgo,
      };
    });

    const response = APIResponse.respondWithSuccess<GETResponse>({
      activities: formattedActivities,
    });
    response.headers.set("last-modified", latestTimestamp.toUTCString());
    return response;
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
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
