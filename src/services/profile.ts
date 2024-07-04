import { eq } from "drizzle-orm";

import { EntityNotFoundError } from "@/exceptions";
import { db } from "@lib/db";
import { User, userTable } from "@lib/db/schema";
import { UpdateProfileSchema } from "@/schemas";

type ReservedFields =
  | "password"
  | "createdAt"
  | "updatedAt"
  | "refreshToken"
  | "phoneNumberVerified"
  | "emailVerified";

export default class ProfileService {
  public async get(id: User["id"]): Promise<Omit<User, ReservedFields>> {
    try {
      const tmp = await db
        .select({
          fullName: userTable.fullName,
          phoneNumber: userTable.phoneNumber,
          email: userTable.email,
          role: userTable.role,
          id: userTable.id,
        })
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (!tmp[0]) throw new EntityNotFoundError("PROFILE");

      return tmp[0];
    } catch (err) {
      throw err;
    }
  }

  public async update(data: Required<UpdateProfileSchema>): Promise<void> {
    try {
      const { fullName, id } = data;

      const tmp = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (!tmp[0]) throw new EntityNotFoundError("USER");

      await db
        .update(userTable)
        .set({
          fullName,
        })
        .where(eq(userTable.id, id));
    } catch (err) {
      throw err;
    }
  }

  public async delete(id: User["id"]): Promise<void> {
    try {
      const tmp = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (!tmp[0]) throw new EntityNotFoundError("USER");

      await db.delete(userTable).where(eq(userTable.id, id));
    } catch (err) {
      throw err;
    }
  }
}
