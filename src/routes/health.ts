import { Router } from "express";
import HealthController from "@controller/health";
import { Routes } from "@/constants";

class HealthRoute implements Routes {
  public path = "/health";
  public router = Router();
  public controller = new HealthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/alive`, this.controller.getLiveness);
    this.router.get(`${this.path}/status`, this.controller.getHealthiness);
  }
}

export default HealthRoute;
