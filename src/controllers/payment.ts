import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import PaymentService from "@service/payment";
import {
  createPaymentSchema,
  createSubscriptionSchema,
  createTransactionSchema,
} from "@/schemas";

export default class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  // Payment Endpoints
  public createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.user;
      const paymentData: any = {
        ...req.body,
        userId,
      };

      const payment = await this.paymentService.createPayment(paymentData);
      res.status(StatusCodes.CREATED).json({
        message: "Payment created successfully",
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  };

  public getPaymentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);
      res.status(StatusCodes.OK).json({
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  };

  public getPaymentsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.user;
      const payments = await this.paymentService.getPaymentsByUserId(userId);
      res.status(StatusCodes.OK).json({
        data: payments,
      });
    } catch (err) {
      next(err);
    }
  };

  public updatePaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(id, status);
      res.status(StatusCodes.OK).json({
        message: "Payment status updated successfully",
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  };

  // Subscription Endpoints
  public createSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.user;
      const subscriptionData: any = {
        ...req.body,
        userId,
      };

      const subscription = await this.paymentService.createSubscription(
        subscriptionData
      );
      res.status(StatusCodes.CREATED).json({
        message: "Subscription created successfully",
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };

  public getSubscriptionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const subscription = await this.paymentService.getSubscriptionById(id);
      res.status(StatusCodes.OK).json({
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };

  public getUserSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.user;
      const subscription = await this.paymentService.getSubscriptionByUserId(
        userId
      );
      res.status(StatusCodes.OK).json({
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateSubscriptionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status, currentPeriodStart, currentPeriodEnd } = req.body;
      const subscription = await this.paymentService.updateSubscriptionStatus(
        id,
        status,
        currentPeriodStart,
        currentPeriodEnd
      );
      res.status(StatusCodes.OK).json({
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };

  // Transaction Endpoints
  public createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactionData: any = req.body;
      const transaction = await this.paymentService.createTransaction(
        transactionData
      );
      res.status(StatusCodes.CREATED).json({
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  };

  public getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const transaction = await this.paymentService.getTransactionById(id);
      res.status(StatusCodes.OK).json({
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  };

  public getTransactionsByPaymentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { paymentId } = req.params;
      const transactions = await this.paymentService.getTransactionsByPaymentId(
        paymentId
      );
      res.status(StatusCodes.OK).json({
        data: transactions,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateTransactionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const transaction = await this.paymentService.updateTransactionStatus(
        id,
        status
      );
      res.status(StatusCodes.OK).json({
        message: "Transaction status updated successfully",
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  };

  // Utility Endpoints
  public getPaymentStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.user;
      const stats = await this.paymentService.getPaymentStats(userId);
      res.status(StatusCodes.OK).json({
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  };
}
