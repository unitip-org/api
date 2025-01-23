import { NextRequest } from "next/server";

interface Params {
  params: {
    job_id: string;
    application_id: string;
  };
}
interface PATCHResponse {
  id: string;
}
export const PATCH = async (request: NextRequest, { params }: Params) => {};
