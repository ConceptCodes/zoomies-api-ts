// Set test environment
process.env.NODE_ENV = "test";

// Test database configuration
process.env.DATABASE_URL =
  "postgres://user:password@localhost:5432/zoomies_test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_REFRESH_SECRET = "test-jwt-refresh";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "1d";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.REDIS_TOKEN = "test-token";
process.env.RESEND_API_KEY = "test-resend-key";

// Export test utilities
export const testUser = {
  email: "test@example.com",
  password: "testpassword123",
  fullName: "Test User",
  phoneNumber: "1234567890",
};

export const testPet = {
  name: "Test Pet",
  age: 3,
  type: "dog",
};

export const testVet = {
  userId: "test-vet-id",
  allowedPetTypes: ["dog", "cat"],
  startHour: 9,
  endHour: 17,
  days: 5,
};

export const testService = {
  name: "Test Service",
  description: "Test service description",
  applicablePetTypes: ["dog"],
  price: 10000,
};
