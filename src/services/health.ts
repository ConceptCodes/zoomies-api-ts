import { IHealthStatus } from "@/constants";
import { checkDatabaseHealth } from "@/lib/db";
import { checkEmailHealth } from "@/lib/mail";

export default class HealthService {
  private healthReport: IHealthStatus[];

  constructor() {
    this.healthReport = [];
  }

  public async checkIntegrationsHealth(): Promise<IHealthStatus[]> {
    this.healthReport = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkEmailHealth(),
    ]);
    return this.healthReport;
  }

  public async checkDatabaseHealth(): Promise<IHealthStatus> {
    const connected = await checkDatabaseHealth();
    return { service: "DATABASE", connected };
  }

  public async checkEmailHealth(): Promise<IHealthStatus> {
    const connected = await checkEmailHealth();
    return { service: "RESEND", connected };
  }
}
