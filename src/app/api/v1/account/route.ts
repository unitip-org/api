import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";

interface PATCHParams {
  params: {
    name: string;
    gender: string;
    password?: string;
  };
}

interface PATCHResponse {
  id: string;
}

export const PATCH = async (request: NextRequest, { params }: PATCHParams) => {
  try {
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};
