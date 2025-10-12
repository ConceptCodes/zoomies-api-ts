if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "local";
}

process.env.DATABASE_URL ??=
  "postgres://user:password@localhost:5432/zoomies_test";
process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.JWT_REFRESH_SECRET ??= "test-jwt-refresh";
process.env.JWT_EXPIRES_IN ??= "1h";
process.env.JWT_REFRESH_EXPIRES_IN ??= "1d";
process.env.REDIS_URL ??= "https://localhost:6379";
process.env.REDIS_TOKEN ??= "test-token";
