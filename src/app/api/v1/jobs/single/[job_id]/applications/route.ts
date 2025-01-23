import { NextRequest } from "next/server";

interface Params {
  params: {
    job_id: string;
  };
}

interface POSTBody {}
interface POSTResponse {}
export const POST = async (request: NextRequest, { params }: Params) => {};

interface DELETEResponse {}
export const DELETE = async (request: NextRequest, { params }: Params) => {};
