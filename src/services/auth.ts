import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import {
  CreateEntityError,
  EmailVerificationError,
  EntityNotFoundError,
  InvalidLoginCredentials,
  InvalidToken,
} from "@/exceptions";
import { db } from "@lib/db";
import { User, sessionTable, userTable } from "@lib/db/schema";
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  VerifyEmailSchema,
} from "@/schemas";
import { env } from "@lib/env";
import { UserPayload } from "@/constants";
import { generateOTPCode, verifyOTPCode } from "@/utils/auth";
import { VerifyEmailData, WelcomeEmailData, sendEmail } from "@/lib/email";

type Tokens = {
  token: string;
  refreshToken: string;
};

export default class AuthService {
  public async login(data: LoginSchema): Promise<Tokens> {
    try {
      const { email, password } = data;

      const tmp = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (!tmp[0]) throw new InvalidLoginCredentials();

      const isMatch = await bcrypt.compare(password, tmp[0].password);
      if (!isMatch) throw new InvalidLoginCredentials();

      if (!tmp[0].emailVerified) {
        const code = await generateOTPCode(email);
        await sendEmail(email, "verify-email", { code });
        throw new EmailVerificationError();
      }

      const { token, refreshToken } = this.generateToken({
        id: tmp[0].id,
        role: tmp[0].role,
      });

      await db.insert(sessionTable).values({
        userId: tmp[0].id,
        token: refreshToken,
        expiresAt: new Date(
          Date.now() + parseInt(env.JWT_REFRESH_EXPIRES_IN) * 1000
        ),
      });

      return { token, refreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async verifyEmail(data: VerifyEmailSchema): Promise<void> {
    try {
      const isVerified = await verifyOTPCode(data);
      if (!isVerified) throw new InvalidToken();

      const user = await db
        .update(userTable)
        .set({ emailVerified: new Date() })
        .where(eq(userTable.email, data.email))
        .returning({
          name: userTable.fullName,
        });

      const payload: WelcomeEmailData = {
        name: user[0].name,
      };

      await sendEmail(data.email, "welcome", payload);
    } catch (err) {
      throw err;
    }
  }

  public async register(data: RegisterSchema): Promise<void> {
    try {
      const { email, password, fullName, phoneNumber } = data;
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.insert(userTable).values({
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
      });

      const code = await generateOTPCode(email);

      const payload: VerifyEmailData = {
        code,
      };

      await sendEmail(email, "verify-email", payload);
    } catch (err) {
      console.error(err);
      throw new CreateEntityError();
    }
  }

  public async logout(userId: User["id"]): Promise<void> {
    try {
      await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
    } catch (err) {
      throw err;
    }
  }

  public async refresh(userId: User["id"]): Promise<Tokens> {
    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (!user[0]) throw new EntityNotFoundError("REFRESH_TOKEN");

      const { token, refreshToken } = this.generateToken({
        id: user[0].id,
        role: user[0].role,
      });

      await db.update(sessionTable).set({
        token: refreshToken,
        userId,
        expiresAt: new Date(
          Date.now() + parseInt(env.JWT_REFRESH_EXPIRES_IN) * 1000
        ),
      });

      return { token, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  public async forgotPassword(data: ForgotPasswordSchema): Promise<any> {
    // TODO: implement forgotPassword
    try {
      console.log(data);
    } catch (err) {}
  }

  private generateToken(data: UserPayload): Tokens {
    try {
      const token = jwt.sign(data, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      const refreshToken = jwt.sign({ id: data.id }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      });

      return { token, refreshToken };
    } catch (err) {
      throw err;
    }
  }
}
