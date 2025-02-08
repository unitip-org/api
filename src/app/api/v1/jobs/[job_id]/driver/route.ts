import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";

interface Params {
  params: {
    job_id: string;
  };
}

interface GETResponse {
  id: string;
  title: string;
  note: string;
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
