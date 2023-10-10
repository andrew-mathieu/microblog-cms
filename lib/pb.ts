import PocketBase from "pocketbase";
import * as types from "@/types/pocketbase-types";
export { types };
export const client = new PocketBase(process.env.POCKETBASE_URL);
