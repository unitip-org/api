import { APIResponse } from "@/lib/models/api-response";

interface User {
  id: string;
  name: string;
  age: number;
}

interface GETResponse {
  success: boolean;
  users: User[];
}
export async function GET() {
  try {
    const users: User[] = [
      { id: "1", name: "John Doe", age: 20 },
      { id: "2", name: "Jane Doe", age: 25 },
    ];

    return APIResponse.respondWithSuccess<GETResponse>({
      success: true,
      users,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
