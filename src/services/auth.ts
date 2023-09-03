import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { EntityNotFoundError, InvalidLoginCredentials } from "@/exceptions";
import { db } from "@lib/db";
import { User, sessionTable, userTable } from "@lib/db/schema";
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
} from "@/schemas";
import { env } from "@lib/env";
import { UserPayload } from "@/constants";

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

  public async logout(userId: User["id"]): Promise<void> {
    try {
      await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
    } catch (err) {}
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

  public async register(data: RegisterSchema): Promise<Tokens> {
    try {
      const { email, password, fullName, phoneNumber } = data;
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("hashedPassword", hashedPassword);

      const user = await db
        .insert(userTable)
        .values({
          email,
          password: hashedPassword,
          fullName,
          phoneNumber,
        })
        .returning();

      const { token, refreshToken } = this.generateToken({
        id: user[0].id,
        role: user[0].role,
      });

      await db.insert(sessionTable).values({
        userId: user[0].id,
        token: refreshToken,
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
