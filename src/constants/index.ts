import { User } from "@/lib/db/schema";

export * from "./interface";
export * from "./enums";

export type UserPayload = Pick<User, "id" | "role">;
