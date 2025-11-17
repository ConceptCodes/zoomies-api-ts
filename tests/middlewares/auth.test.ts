import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { authMiddleware } from "../../src/middlewares/auth";
import { StatusCodes } from "http-status-codes";
import { mockJWT } from "../mocks";

describe("Auth Middleware", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {},
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

  describe("JWT token validation", () => {
    test("should call next with valid token", async () => {
      // Arrange
      const validToken = mockJWT.sign(
        { id: "user-id", role: "USER" },
        "test-secret"
      );
      mockRequest.headers = { authorization: `Bearer ${validToken}` };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.user).toEqual({ id: "user-id", role: "USER" });
    });

    test("should return 401 with missing token", async () => {
      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test("should return 401 with invalid token format", async () => {
      // Arrange
      mockRequest.headers = { authorization: "InvalidToken" };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test("should return 401 with expired token", async () => {
      // Arrange
      const expiredToken = mockJWT.sign(
        { id: "user-id", role: "USER" },
        "test-secret",
        { expiresIn: "0s" }
      );
      mockRequest.headers = { authorization: `Bearer ${expiredToken}` };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test("should return 401 with malformed Bearer token", async () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer malformed.token" };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("User payload extraction", () => {
    test("should extract user payload correctly", async () => {
      // Arrange
      const validToken = mockJWT.sign(
        { id: "user-123", role: "ADMIN" },
        "test-secret"
      );
      mockRequest.headers = { authorization: `Bearer ${validToken}` };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockRequest.user).toEqual({ id: "user-123", role: "ADMIN" });
    });

    test("should handle malformed JWT gracefully", async () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer not.a.jwt" };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("Error handling", () => {
    test("should pass through database errors", async () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer valid-token" };
      const dbError = new Error("Database connection failed");
      mockNext.mockImplementation(() => {
        throw dbError;
      });

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test("should handle unexpected errors gracefully", async () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer valid-token" };
      const unexpectedError = new Error("Unexpected error");
      mockNext.mockImplementation(() => {
        throw unexpectedError;
      });

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    });
  });

  describe("Request object enhancement", () => {
    test("should add user to request object", async () => {
      // Arrange
      const validToken = mockJWT.sign(
        { id: "user-123", role: "USER" },
        "test-secret"
      );
      mockRequest.headers = { authorization: `Bearer ${validToken}` };

      // Act
      await authMiddleware(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockRequest.user).toBeDefined();
      expect(typeof mockRequest.user).toBe("object");
      expect(mockRequest.user.id).toBe("user-123");
      expect(mockRequest.user.role).toBe("USER");
    });
  });
});
