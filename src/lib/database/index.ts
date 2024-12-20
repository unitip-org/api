import { Model, XataDialect } from "@xata.io/kysely";
import { Kysely } from "kysely";
import { DatabaseSchema, getXataClient } from "./xata";

export const xata = getXataClient();
export const database = new Kysely<Model<DatabaseSchema>>({
  dialect: new XataDialect({ xata }),
});
