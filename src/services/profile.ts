import { eq } from "drizzle-orm";

import { EntityNotFoundError } from "@/exceptions";
import { db } from "@lib/db";
import { User, userTable } from "@lib/db/schema";
import { UpdateProfileSchema } from "@/schemas";
import { doesUserExist } from "@/utils/auth";

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
          notificationPreferences: userTable.notificationPreferences,
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

  public async update(
    id: User["id"],
    data: UpdateProfileSchema
  ): Promise<void> {
    try {
      const exist = await doesUserExist(id);
      if (!exist) throw new EntityNotFoundError("USER");

      const updates: Partial<User> = {};
      if (data.fullName !== undefined) {
        updates.fullName = data.fullName;
      }
      if (data.notificationPreferences !== undefined) {
        updates.notificationPreferences = data.notificationPreferences as User["notificationPreferences"];
      }

      if (!Object.keys(updates).length) {
        return;
      }

      updates.updatedAt = new Date();

      await db.update(userTable).set(updates).where(eq(userTable.id, id));
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
