import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { ValidationMiddleware } from "../../src/middlewares/validation";
import { StatusCodes } from "http-status-codes";

describe("Validation Middleware", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
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
      statusCalls: [] as any[],
      jsonCalls: [] as any[],
    };

    mockNext = (error?: Error) => {
      mockNext.calls = mockNext.calls || [];
      mockNext.calls.push(error);
    };
  });

  describe("Schema validation", () => {
    test("should call next with valid request body", async () => {
      // Arrange
      const validSchema = {
        email: "test@example.com",
        password: "password123",
      };
      mockRequest.body = validSchema;

      // Act
      await validationMiddleware(validSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test("should return 400 with invalid request body", async () => {
      // Arrange
      const invalidSchema = {
        email: "invalid-email",
        password: "123", // too short
      };
      mockRequest.body = invalidSchema;

      // Act
      await ValidationMiddleware(invalidSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    test("should handle missing required fields", async () => {
      // Arrange
      const incompleteSchema = {
        email: "test@example.com",
        // password missing
      };
      mockRequest.body = incompleteSchema;

      // Act
      await ValidationMiddleware(incompleteSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Type conversion and validation", () => {
    test("should validate email format", async () => {
      // Arrange
      const invalidEmailSchema = {
        email: "not-an-email",
        password: "validpassword123",
      };
      mockRequest.body = invalidEmailSchema;

      // Act
      await ValidationMiddleware(invalidEmailSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    test("should validate password length", async () => {
      // Arrange
      const shortPasswordSchema = {
        email: "test@example.com",
        password: "123", // too short
      };
      mockRequest.body = shortPasswordSchema;

      // Act
      await ValidationMiddleware(shortPasswordSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    test("should validate phone number format", async () => {
      // Arrange
      const invalidPhoneSchema = {
        email: "test@example.com",
        password: "validpassword123",
        phoneNumber: "abc", // invalid
      };
      mockRequest.body = invalidPhoneSchema;

      // Act
      await ValidationMiddleware(invalidPhoneSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Error response format", () => {
    test("should return consistent error format", async () => {
      // Arrange
      const invalidSchema = { email: "invalid" };
      mockRequest.body = invalidSchema;

      // Act
      await ValidationMiddleware(invalidSchema)(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

      // Check if error response was formatted correctly
      const errorCall = mockNext.calls[0];
      expect(errorCall).toBeInstanceOf(Error);
      expect(errorCall.message).toBeDefined();
    });
  });

  describe("Request object integrity", () => {
    test("should not modify original request object", async () => {
      // Arrange
      const originalBody = { email: "test@example.com" };
      mockRequest.body = originalBody;

      // Act
      await ValidationMiddleware({ email: "test@example.com" })(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockRequest.body).toEqual(originalBody);
    });
  });
});
