"use client";

import { swaggerSpec } from "@/lib/swagger/spec";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Page() {
  return (
    <section className="container mx-auto dark:invert">
      <SwaggerUI
        spec={swaggerSpec}
        displayOperationId
        displayRequestDuration
        defaultModelRendering="model"
        persistAuthorization
      />
    </section>
  );
}
