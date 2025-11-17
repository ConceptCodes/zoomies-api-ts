import { Router } from "express";
import { authMiddleware } from "@middleware/auth";
import PaymentController from "@controller/payment";
import { validationMiddleware } from "@middleware/validation";
import { allowedRoles } from "@middleware/auth";

export default class PaymentRoutes {
  public router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.router = Router();
    this.paymentController = new PaymentController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Payment Routes
    this.router.post(
      "/payments",
      authMiddleware,
      validationMiddleware({
        userId: true,
        appointmentId: true,
        amount: true,
        currency: true,
      }),
      this.paymentController.createPayment
    );

    this.router.get(
      "/payments/:id",
      authMiddleware,
      this.paymentController.getPaymentById
    );

    this.router.get(
      "/payments/user/:userId",
      authMiddleware,
      allowedRoles(["ADMIN"]),
      this.paymentController.getPaymentsByUser
    );

    this.router.patch(
      "/payments/:id/status",
      authMiddleware,
      ValidationMiddleware({
        status: true,
      }),
      this.paymentController.updatePaymentStatus
    );

    // Subscription Routes
    this.router.post(
      "/subscriptions",
      authMiddleware,
      ValidationMiddleware({
        userId: true,
        polarProductId: true,
        polarSubscriptionId: true,
        status: true,
      }),
      this.paymentController.createSubscription
    );

    this.router.get(
      "/subscriptions/:id",
      authMiddleware,
      this.paymentController.getSubscriptionById
    );

    this.router.get(
      "/subscriptions/user/:userId",
      authMiddleware,
      this.paymentController.getUserSubscription
    );

    this.router.patch(
      "/subscriptions/:id/status",
      authMiddleware,
      validationMiddleware({
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
      }),
      this.paymentController.updateSubscriptionStatus
    );

    // Transaction Routes
    this.router.post(
      "/transactions",
      authMiddleware,
      ValidationMiddleware({
        paymentId: true,
        type: true,
        amount: true,
        currency: true,
        status: true,
        metadata: true,
      }),
      this.paymentController.createTransaction
    );

    this.router.get(
      "/transactions/:id",
      authMiddleware,
      this.paymentController.getTransactionById
    );

    this.router.get(
      "/transactions/payment/:paymentId",
      authMiddleware,
      this.paymentController.getTransactionsByPaymentId
    );

    this.router.patch(
      "/transactions/:id/status",
      authMiddleware,
      ValidationMiddleware({
        status: true,
      }),
      this.paymentController.updateTransactionStatus
    );

    // Utility Routes
    this.router.get(
      "/payments/stats/:userId",
      authMiddleware,
      this.paymentController.getPaymentStats
    );
  }
}
