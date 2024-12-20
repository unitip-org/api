import docJobs from "@/app/api/v1/jobs/docs.json";
import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./swagger";

export default async function Page() {
  const spec = await getApiDocs();
  const newSpec = {
    openapi: "3.1.0",
    info: { title: "Unitip API Documentation", version: "1.0" },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        hehe: {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
          },
        },
      },
    },
    paths: {
      ...docJobs.paths,
    },
  };

  return (
    <section className="container">
      {/* <ReactSwagger spec={spec} /> */}
      <ReactSwagger spec={newSpec} />
    </section>
  );
}
