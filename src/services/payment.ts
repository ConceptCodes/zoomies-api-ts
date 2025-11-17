import { eq } from "drizzle-orm";

import { db } from "@lib/db";
import {
  Payment,
  Subscription,
  Transaction,
  paymentTable,
  subscriptionTable,
  transactionTable,
} from "@lib/db/schema";
import { takeFirst } from "@/utils";

export default class PaymentService {
  // Payment Methods
  public async createPayment(data: any): Promise<Payment> {
    try {
      const payment = await db
        .insert(paymentTable)
        .values({
          ...data,
          status: "pending",
        })
        .returning();
      return takeFirst(payment)!;
    } catch (error) {
      throw error;
    }
  }

  public async getPaymentById(id: Payment["id"]): Promise<Payment> {
    try {
      const payment = await db
        .select()
        .from(paymentTable)
        .where(eq(paymentTable.id, id))
        .limit(1);
      return takeFirst(payment)!;
    } catch (error) {
      throw error;
    }
  }

  public async updatePaymentStatus(
    id: Payment["id"],
    status: Payment["status"]
  ): Promise<Payment> {
    try {
      const payment = await db
        .update(paymentTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(paymentTable.id, id))
        .returning();
      return takeFirst(payment)!;
    } catch (error) {
      throw error;
    }
  }

  public async getPaymentsByUserId(
    userId: Payment["userId"]
  ): Promise<Payment[]> {
    try {
      const payments = await db
        .select()
        .from(paymentTable)
        .where(eq(paymentTable.userId, userId));
      return payments;
    } catch (error) {
      throw error;
    }
  }

  // Subscription Methods
  public async createSubscription(data: any): Promise<Subscription> {
    try {
      const subscription = await db
        .insert(subscriptionTable)
        .values({
          ...data,
          status: "active",
        })
        .returning();
      return takeFirst(subscription)!;
    } catch (error) {
      throw error;
    }
  }

  public async getSubscriptionById(
    id: Subscription["id"]
  ): Promise<Subscription> {
    try {
      const subscription = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.id, id))
        .limit(1);
      return takeFirst(subscription)!;
    } catch (error) {
      throw error;
    }
  }

  public async getSubscriptionByUserId(
    userId: Subscription["userId"]
  ): Promise<Subscription | null> {
    try {
      const subscription = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, userId))
        .limit(1);
      return takeFirst(subscription) || null;
    } catch (error) {
      throw error;
    }
  }

  public async updateSubscriptionStatus(
    id: Subscription["id"],
    status: Subscription["status"]
  ): Promise<Subscription> {
    try {
      const subscription = await db
        .update(subscriptionTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(subscriptionTable.id, id))
        .returning();
      return takeFirst(subscription)!;
    } catch (error) {
      throw error;
    }
  }

  // Transaction Methods
  public async createTransaction(data: any): Promise<Transaction> {
    try {
      const transaction = await db
        .insert(transactionTable)
        .values({
          ...data,
          status: "pending",
        })
        .returning();
      return takeFirst(transaction)!;
    } catch (error) {
      throw error;
    }
  }

  public async getTransactionById(id: Transaction["id"]): Promise<Transaction> {
    try {
      const transaction = await db
        .select()
        .from(transactionTable)
        .where(eq(transactionTable.id, id))
        .limit(1);
      return takeFirst(transaction)!;
    } catch (error) {
      throw error;
    }
  }

  public async getTransactionsByPaymentId(
    paymentId: Transaction["paymentId"]
  ): Promise<Transaction[]> {
    try {
      const transactions = await db
        .select()
        .from(transactionTable)
        .where(eq(transactionTable.paymentId, paymentId));
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  public async updateTransactionStatus(
    id: Transaction["id"],
    status: Transaction["status"]
  ): Promise<Transaction> {
    try {
      const transaction = await db
        .update(transactionTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(transactionTable.id, id))
        .returning();
      return takeFirst(transaction)!;
    } catch (error) {
      throw error;
    }
  }

  // Utility Methods
  public async getPaymentStats(userId: Payment["userId"]): Promise<{
    totalPayments: number;
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
  }> {
    try {
      const payments = await this.getPaymentsByUserId(userId);

      const totalPayments = payments.length;
      const totalAmount = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const successfulPayments = payments.filter(
        (p) => p.status === "completed"
      ).length;
      const failedPayments = payments.filter(
        (p) => p.status === "failed"
      ).length;

      return {
        totalPayments,
        totalAmount,
        successfulPayments,
        failedPayments,
      };
    } catch (error) {
      throw error;
    }
  }
}
