import { UserPayload } from "@/constants";
import { Optional } from "../../global";

declare module "express-serve-static-core" {
  interface Request {
    id: Optional<string>;
    user: UserPayload;
  }
}
