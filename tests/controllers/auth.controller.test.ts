import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import AuthController from "../../src/controllers/auth";
import { MockEmailService, MockRedis } from "../mocks";
import { TestDatabaseHelper } from "../helpers/database";
import { userFixtures, authFixtures } from "../fixtures";
import { StatusCodes } from "http-status-codes";

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeAll(async () => {
    authController = new AuthController();
  });

  beforeEach(() => {
    MockEmailService.clear();
    MockRedis.prototype.clear();

    mockRequest = {
      body: {},
      headers: {},
      cookies: {},
      user: { id: "test-user-id" },
    };

    mockResponse = {
      status: (code: number) => {
        mockResponse.statusCalls = mockResponse.statusCalls || [];
        mockResponse.statusCalls.push(code);
      },
      json: (data: any) => {
        mockResponse.jsonCalls = mockResponse.jsonCalls || [];
        mockResponse.jsonCalls.push(data);
      },
      cookie: (name: string, value: string, options?: any) => {
        mockResponse.cookieCalls = mockResponse.cookieCalls || [];
        mockResponse.cookieCalls.push({ name, value, options });
      },
      header: (name: string, value: string) => {
        mockResponse.headerCalls = mockResponse.headerCalls || [];
        mockResponse.headerCalls.push({ name, value });
      },
      clearCookie: (name: string) => {
        mockResponse.clearCookieCalls = mockResponse.clearCookieCalls || [];
        mockResponse.clearCookieCalls.push(name);
      },
      statusCalls: [] as any[],
      jsonCalls: [] as any[],
      cookieCalls: [] as any[],
      headerCalls: [] as any[],
      clearCookieCalls: [] as string[],
    };

    mockNext = (error?: Error) => {
      mockNext.calls = mockNext.calls || [];
      mockNext.calls.push(error);
    };
  });

  afterAll(async () => {
    await TestDatabaseHelper.cleanDatabase();
  });

  describe("login", () => {
    test("should return 200 with valid credentials", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      await authController.login(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.OK);
      expect(mockResponse.jsonCalls).toContain({
        message: "Login successful.",
      });
      expect(
        mockResponse.headerCalls.some(
          (call) =>
            call.name === "Authorization" && call.value.includes("Bearer")
        )
      ).toBe(true);
      expect(
        mockResponse.cookieCalls.some(
          (call) =>
            call.name === "refreshToken" &&
            call.options?.httpOnly === true &&
            call.options?.secure === true
        )
      ).toBe(true);
    });

    test("should return 401 with invalid credentials", async () => {
      // Arrange
      mockRequest.body = authFixtures.invalidLogin;

      // Act
      await authController.login(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockNext.calls.length).toBeGreaterThan(0);
      expect(mockNext.calls[0]).toBeInstanceOf(Error);
      expect(mockResponse.statusCalls.length).toBe(0);
    });
  });

  describe("register", () => {
    test("should return 201 with valid registration data", async () => {
      // Arrange
      mockRequest.body = userFixtures.validUser;

      // Act
      await authController.register(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.CREATED);
      expect(mockResponse.jsonCalls).toContain({
        message: "Verify your email address to complete registration.",
      });
      expect(
        MockEmailService.getEmailsTo(userFixtures.validUser.email)
      ).toHaveLength(1);
    });
  });

  describe("verifyEmail", () => {
    test("should return 200 with valid verification code", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);
      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      const verificationCode = emails[0].html.match(/(\d{6})/)?.[1];

      mockRequest.body = {
        email: userFixtures.validUser.email,
        code: verificationCode,
      };

      // Act
      await authController.verifyEmail(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.OK);
      expect(mockResponse.jsonCalls).toContain({
        message: "Email verified successfully.",
      });
    });
  });

  describe("forgotPassword", () => {
    test("should return 200 for existing user", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);
      mockRequest.body = {
        email: userFixtures.validUser.email,
      };

      // Act
      await authController.forgotPassword(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.OK);
      expect(mockResponse.jsonCalls).toContain({
        message:
          "If an account with that email exists, a password reset code has been sent.",
      });
      expect(
        MockEmailService.getEmailsTo(userFixtures.validUser.email)
      ).toHaveLength(1);
    });
  });

  describe("resetPassword", () => {
    test("should return 200 with valid reset data", async () => {
      // Arrange
      await TestDatabaseHelper.createTestUser(userFixtures.validUser);
      await authController.forgotPassword({
        email: userFixtures.validUser.email,
      });

      const emails = MockEmailService.getEmailsTo(userFixtures.validUser.email);
      const resetCode = emails[1].html.match(/(\d{6})/)?.[1];

      mockRequest.body = {
        email: userFixtures.validUser.email,
        code: resetCode,
        password: "newpassword123",
      };

      // Act
      await authController.resetPassword(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.OK);
      expect(mockResponse.jsonCalls).toContain({
        message:
          "Password reset successfully. Please login with your new password.",
      });
    });
  });

  describe("logout", () => {
    test("should return 200 and clear refresh token cookie", async () => {
      // Arrange
      mockRequest.user = { id: "test-user-id" };

      // Act
      await authController.logout(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.statusCalls).toContain(StatusCodes.OK);
      expect(mockResponse.clearCookieCalls).toContain("refreshToken");
    });
  });
});
