import { eq } from "drizzle-orm";

import { get, set } from "@/lib/redis";
import { VerifyEmailSchema } from "@/schemas";
import { User, userTable } from "@/lib/db/schema";
import { db } from "@lib/db";

const getOtpKey = (email: string) => `otp:${email}`;

export const generateOTPCode = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const key = getOtpKey(email);
  await set(key, otp);
  return otp;
};

export const verifyOTPCode = async (
  data: VerifyEmailSchema
): Promise<boolean> => {
  const key = getOtpKey(data.email);
  const value = await get(key);
  console.log(value, data.code);
  return value == data.code;
};

export const doesUserExist = async (id: User["id"]): Promise<boolean> => {
  const tmp = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  return !!tmp[0];
};
