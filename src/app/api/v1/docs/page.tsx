import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./swagger";

export default async function Page() {
  const spec = await getApiDocs("src/app/api/v1");

  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
