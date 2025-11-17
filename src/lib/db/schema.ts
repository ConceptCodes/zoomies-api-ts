import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { env } from "@lib/env";
import type { NotificationPreferences } from "@lib/notifications/types";

export const userTable = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
  role: text("role", { enum: ["ADMIN", "USER"] })
    .notNull()
    .default("USER"),
  email: varchar("email", { length: 256 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  phoneNumberVerified: timestamp("phone_number_verified"),
  password: varchar("password", { length: 256 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 256 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  notificationPreferences: jsonb("notification_preferences")
    .$type<NotificationPreferences>()
    .notNull()
    .default(
      sql`'{"channels":["EMAIL"],"upcomingAppointments":{"enabled":true}}'::jsonb`
    ),
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
export const insertUserSchema = createInsertSchema(userTable);

const species = [
  "dog",
  "cat",
  "bird",
  "hamster",
  "unknown",
  "fish",
  "rabbit",
  "turtle",
  "snake",
  "lizard",
  "guinea_pig",
  "horse",
  "goat",
] as const;
export type Species = (typeof species)[number];

export const PetTypeSEnum = pgEnum("species", species);

export const vetTable = pgTable("vet", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  allowedPetTypes: PetTypeSEnum("type").array().notNull(),
  startHour: integer("start_hour").notNull().default(9),
  endHour: integer("end_hour").notNull().default(17),
  days: integer("days").notNull().default(5),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Vet = typeof vetTable.$inferSelect;
export type NewVet = typeof vetTable.$inferInsert;
export const insertVetSchema = createInsertSchema(vetTable);

export const petTable = pgTable("pet", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  type: PetTypeSEnum("type").notNull().default("unknown"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Pet = typeof petTable.$inferSelect;
export type NewPet = typeof petTable.$inferInsert;
export const insertPetSchema = createInsertSchema(petTable);

export const serviceTable = pgTable("service", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  applicablePetTypes: PetTypeSEnum("applicable_pet_type").array().notNull(),
  price: integer("price").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Service = typeof serviceTable.$inferSelect;
export type NewService = typeof serviceTable.$inferInsert;
export const insertServiceSchema = createInsertSchema(serviceTable);

export const appointmentTable = pgTable("appointment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  petId: uuid("pet_id")
    .notNull()
    .references(() => petTable.id),
  vetId: uuid("vet_id")
    .notNull()
    .references(() => userTable.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => serviceTable.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  date: timestamp("date", { withTimezone: true }).notNull(),
  description: text("description").notNull(),
  duration: integer("duration").default(env.DEFAULT_APPOINTMENT_DURATION),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Appointment = typeof appointmentTable.$inferSelect;
export type NewAppointment = typeof appointmentTable.$inferInsert;
export const insertAppointmentSchema = createInsertSchema(appointmentTable);

export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userTable.id),
  token: varchar("token", { length: 256 }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Session = typeof sessionTable.$inferSelect;

// Payment Tables
export const paymentTable = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointmentTable.id),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 20 }).notNull(), // pending, completed, failed, refunded
  polarPaymentId: varchar("polar_payment_id", { length: 256 }),
  polarCheckoutId: varchar("polar_checkout_id", { length: 256 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptionTable = pgTable("subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  polarProductId: varchar("polar_product_id", { length: 256 }).notNull(),
  polarSubscriptionId: varchar("polar_subscription_id", { length: 256 }),
  status: varchar("status", { length: 20 }).notNull(), // active, cancelled, expired
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionTable = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => paymentTable.id),
  type: varchar("type", { length: 20 }).notNull(), // payment, refund, subscription_payment
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 20 }).notNull(), // pending, completed, failed
  polarTransactionId: varchar("polar_transaction_id", { length: 256 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Payment = typeof paymentTable.$inferSelect;
export type NewPayment = typeof paymentTable.$inferInsert;
export type Subscription = typeof subscriptionTable.$inferSelect;
export type NewSubscription = typeof subscriptionTable.$inferInsert;
export type Transaction = typeof transactionTable.$inferSelect;
export type NewTransaction = typeof transactionTable.$inferInsert;
export const insertPaymentSchema = createInsertSchema(paymentTable);
export const insertSubscriptionSchema = createInsertSchema(subscriptionTable);
export const insertTransactionSchema = createInsertSchema(transactionTable);
