import { Router } from "express";

export interface IHealthStatus {
  service: string;
  isConnected: boolean;
}

export interface Routes {
  path?: string;
  router: Router;
}
