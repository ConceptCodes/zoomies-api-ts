import { IHealthStatus } from "@/constants";

export default class HealthService {
  private healthReport: IHealthStatus[];

  constructor() {
    this.healthReport = [];
  }

  public async checkIntegrationsHealth(): Promise<IHealthStatus[]> {
    this.healthReport = [];
    return this.healthReport;
  }
}
