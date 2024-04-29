import { get, set } from "@/lib/redis";
import { VerifyEmailSchema } from "@/schemas";

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
  return value === data.code;
};
