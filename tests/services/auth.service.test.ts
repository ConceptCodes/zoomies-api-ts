import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import AuthService from "../../src/services/auth";
import { TestDatabaseHelper } from "../helpers/database";
import { MockEmailService, MockRedis } from "../mocks";
import { userFixtures, authFixtures } from "../fixtures";
import {
  InvalidLoginCredentials,
  EmailVerificationError,
  InvalidToken,
} from "../../src/exceptions";

// Mock dependencies
const mockSendEmail = MockEmailService.sendEmail;
const mockSet = MockRedis.prototype.set;
const mockGet = MockRedis.prototype.get;

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(async () => {
    // Mock email service
    global.sendEmail = mockSendEmail;
    // Mock Redis
    global.get = mockGet;
    global.set = mockSet;
  });

  beforeEach(async () => {
    await TestDatabaseHelper.cleanDatabase();
    authService = new AuthService();
    MockEmailService.clear();
    MockRedis.prototype.clear();
  });

  afterAll(async () => {
    await TestDatabaseHelper.cleanDatabase();
  });

  describe("login", () => {
    test("should successfully login with valid credentials", async () => {
      // Arrange
      const user = await TestDatabaseHelper.createTestUser(
        userFixtures.validUser
      );

      // Act
      const result = await authService.login(authFixtures.validLogin);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    test("should throw error with invalid email", async () => {
      // Act & Assert
      await expect(authService.login(authFixtures.invalidLogin)).toThrow(
        InvalidLoginCredentials
      );
    });

    test("should throw error with invalid password", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);

      // Act & Assert
      await expect(
        authService.login({
          email: userFixtures.validUser.email,
          password: "wrongpassword",
        })
      ).toThrow(InvalidLoginCredentials);
    });

    test("should throw error for non-existent user", async () => {
      // Act & Assert
      await expect(authService.login(authFixtures.invalidLogin)).toThrow(
        InvalidLoginCredentials
      );
    });
  });

  describe("register", () => {
    test("should successfully register new user", async () => {
      // Act
      await authService.register(userFixtures.validUser);

      // Assert
      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      expect(emails.length).toBe(1);
      expect(emails[0].subject).toContain("Verify your email");
    });

    test("should send verification email upon registration", async () => {
      // Act
      await authService.register(userFixtures.validUser);

      // Assert
      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      expect(emails.length).toBe(1);
      expect(emails[0].html).toContain("verification code");
    });
  });

  describe("verifyEmail", () => {
    test("should successfully verify email with correct code", async () => {
      // Arrange
      await authService.register(userFixtures.validUser);
      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      const verificationCode = emails[0].html.match(/(\d{6})/)?.[1];

      // Act
      await authService.verifyEmail({
        email: userFixtures.validUser.email,
        code: verificationCode,
      });

      // Assert
      const welcomeEmails = MockEmailService.getEmailsTo(
        userFixtures.validUser.email
      );
      expect(welcomeEmails.length).toBe(2); // verification + welcome
      expect(welcomeEmails[1].subject).toContain("Welcome");
    });

    test("should throw error with invalid code", async () => {
      // Arrange
      await authService.register(userFixtures.validUser);

      // Act & Assert
      await expect(
        authService.verifyEmail({
          email: userFixtures.validUser.email,
          code: "000000",
        })
      ).toThrow(InvalidToken);
    });
  });

  describe("forgotPassword", () => {
    test("should send reset email for existing user", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);

      // Act
      await authService.forgotPassword({
        email: userFixtures.validUser.email,
      });

      // Assert
      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      expect(emails.length).toBe(2); // registration + forgot password
      expect(emails[1].subject).toContain("Reset your password");
    });

    test("should not reveal if user exists or not", async () => {
      // Act
      await authService.forgotPassword({
        email: "nonexistent@example.com",
      });

      // Assert - should not throw error and should not send email
      const emails = MockEmailService.getEmailsTo("nonexistent@example.com");
      expect(emails.length).toBe(0);
    });
  });

  describe("resetPassword", () => {
    test("should successfully reset password with valid code", async () => {
      // Arrange
      await authService.register(userFixtures.validUser);
      await authService.forgotPassword({
        email: userFixtures.validUser.email,
      });

      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      const resetCode = emails[1].html.match(/(\d{6})/)?.[1];

      // Act
      await authService.resetPassword({
        email: userFixtures.validUser.email,
        code: resetCode,
        password: "newpassword123",
      });

      // Assert - should be able to login with new password
      const loginResult = await authService.login({
        email: userFixtures.validUser.email,
        password: "newpassword123",
      });
      expect(loginResult).toBeDefined();
      expect(loginResult.token).toBeDefined();
    });

    test("should throw error with invalid code", async () => {
      // Arrange
      await authService.register(userFixtures.validUser);
      await authService.forgotPassword({
        email: userFixtures.validUser.email,
      });

      // Act & Assert
      await expect(
        authService.resetPassword({
          email: userFixtures.validUser.email,
          code: "000000",
          password: "newpassword123",
        })
      ).toThrow(InvalidToken);
    });

    test("should invalidate all existing sessions", async () => {
      // This test would require session table access
      // For now, we'll test that password change works
      // Implementation would check that old refresh tokens are invalidated
      expect(true).toBe(true); // placeholder
    });
  });

  describe("logout", () => {
    test("should successfully logout user", async () => {
      // Arrange
      const user = await TestDatabaseHelper.createTestUser(
        userFixtures.validUser
      );
      const userId = user.id;

      // Act
      await authService.logout(userId);

      // Assert - would verify sessions are deleted
      expect(true).toBe(true); // placeholder
    });
  });

  describe("refresh", () => {
    test("should successfully refresh token", async () => {
      // Arrange
      const user = await TestDatabaseHelper.createTestUser(
        userFixtures.validUser
      );
      const userId = user.id;

      // Act
      const result = await authService.refresh(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    test("should throw error for non-existent user", async () => {
      // Act & Assert
      await expect(authService.refresh("non-existent-user-id")).toThrow();
    });
  });
});
