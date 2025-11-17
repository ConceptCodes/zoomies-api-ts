import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import {
  CreateEntityError,
  EmailVerificationError,
  InvalidLoginCredentials,
  InvalidToken,
} from "@/exceptions";
import { db } from "@lib/db";
import { User, sessionTable, userTable } from "@lib/db/schema";
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from "@/schemas";
import { env } from "@lib/env";
import { UserPayload } from "@/constants";
import { generateOTPCode, verifyOTPCode } from "@/utils/auth";
import {
  ResetPasswordEmailData,
  VerifyEmailData,
  WelcomeEmailData,
  sendEmail,
} from "@/lib/email";
import { takeFirstOrThrow } from "@/utils";

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
        await sendEmail(email, "verifyEmail", { code });
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

      const users = await db
        .update(userTable)
        .set({ emailVerified: new Date() })
        .where(eq(userTable.email, data.email))
        .returning({
          name: userTable.fullName,
        });

      const user = takeFirstOrThrow(users);

      const payload: WelcomeEmailData = {
        name: user.name,
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

      const code = await generateOTPCode(email);

      const payload: VerifyEmailData = {
        code,
      };

      await sendEmail(email, "verifyEmail", payload);

      await db.insert(userTable).values({
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
      });
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
      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      const user = takeFirstOrThrow(users);

      const { token, refreshToken } = this.generateToken({
        id: user.id,
        role: user.role,
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

  public async forgotPassword(data: ForgotPasswordSchema): Promise<void> {
    try {
      const { email } = data;

      // Check if user exists
      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (!users[0]) {
        // Don't reveal if email exists or not for security
        return;
      }

      // Generate and send reset code
      const code = await generateOTPCode(email);
      const payload: ResetPasswordEmailData = { code };
      await sendEmail(email, "resetPassword", payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async resetPassword(data: ResetPasswordSchema): Promise<void> {
    try {
      const { email, code, password } = data;

      // Verify the reset code
      const isVerified = await verifyOTPCode({ email, code });
      if (!isVerified) {
        throw new InvalidToken();
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      await db
        .update(userTable)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(userTable.email, email));

      // Invalidate all existing sessions for this user
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (user[0]) {
        await db
          .delete(sessionTable)
          .where(eq(sessionTable.userId, user[0].id));
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
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
