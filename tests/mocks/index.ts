// Mock Redis client for testing
export class MockRedis {
  private data: Map<string, string> = new Map();
  private listData: Map<string, string[]> = new Map();
  private sortedData: Map<string, Map<string, number>> = new Map();

  async set(key: string, value: string, options?: any) {
    this.data.set(key, value);
    return "OK";
  }

  async get(key: string) {
    return this.data.get(key) || null;
  }

  async del(key: string) {
    this.data.delete(key);
    return 1;
  }

  async lpush(key: string, value: string) {
    if (!this.listData.has(key)) {
      this.listData.set(key, []);
    }
    this.listData.get(key)!.push(value);
    return this.listData.get(key)!.length;
  }

  async rpop(key: string) {
    const list = this.listData.get(key);
    if (!list || list.length === 0) return null;
    return list.pop() || null;
  }

  async zadd(key: string, score: number, member: string) {
    if (!this.sortedData.has(key)) {
      this.sortedData.set(key, new Map());
    }
    this.sortedData.get(key)!.set(member, score);
    return 1;
  }

  async zrem(key: string, member: string) {
    const sorted = this.sortedData.get(key);
    if (sorted) {
      sorted.delete(member);
      return 1;
    }
    return 0;
  }

  async zrange(key: string, min: number, max: number, options?: any) {
    const sorted = this.sortedData.get(key);
    if (!sorted) return [];

    const result: string[] = [];
    for (const [member, score] of sorted.entries()) {
      if (score >= min && score <= max) {
        result.push(member);
      }
    }

    if (options?.byScore) {
      return result;
    }

    return result;
  }

  async exists(key: string) {
    return this.data.has(key) ? 1 : 0;
  }

  clear() {
    if (this.data) this.data.clear();
    if (this.listData) this.listData.clear();
    if (this.sortedData) this.sortedData.clear();
  }
}

// Mock email service
export class MockEmailService {
  static sentEmails: Array<{
    to: string;
    subject: string;
    html: string;
  }> = [];

  static async sendEmail(to: string, template: string, data: any) {
    this.sentEmails.push({
      to,
      subject: `Mock ${template} email`,
      html: `Mock ${template} content with data: ${JSON.stringify(data)}`,
    });
  }

  static clear() {
    this.sentEmails = [];
  }

  static getLastEmail() {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  static getEmailsTo(to: string) {
    return this.sentEmails.filter((email) => email.to === to);
  }
}

// Mock JWT utilities
export const mockJWT = {
  sign: (payload: any, secret: string, options?: any) => {
    return `mock.jwt.${btoa(JSON.stringify(payload))}`;
  },

  verify: (token: string, secret: string) => {
    if (!token.startsWith("mock.jwt.")) return null;
    try {
      const payload = JSON.parse(atob(token.slice(10)));
      return payload;
    } catch {
      return null;
    }
  },
};

// Mock environment variables
export const mockEnv = {
  NODE_ENV: "test",
  PORT: 8000,
  DATABASE_URL: "postgres://test:test@localhost:5432/zoomies_test",
  JWT_SECRET: "test-jwt-secret",
  JWT_REFRESH_SECRET: "test-jwt-refresh",
  JWT_EXPIRES_IN: "1h",
  JWT_REFRESH_EXPIRES_IN: "1d",
  RESEND_API_KEY: "test-resend-key",
  REDIS_URL: "redis://localhost:6379",
  REDIS_TOKEN: "test-token",
};
