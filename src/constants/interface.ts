import { Router } from "express";
import { Services } from "./enums";

export interface IHealthStatus {
  service: keyof typeof Services;
  connected: boolean;
}

export interface Routes {
  path?: string;
  router: Router;
}
