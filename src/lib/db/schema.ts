import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { env } from "@lib/env";

export const userTable = pgTable("user", {
  id: serial("id").notNull().primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
  role: text("role", { enum: ["ADMIN", "USER"] })
    .notNull()
    .default("USER"),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 256 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
export const insertUserSchema = createInsertSchema(userTable);

const PetType = [
  "DOG",
  "CAT",
  "BIRD",
  "HAMSTER",
  "UNKNOWN",
  "FISH",
  "RABBIT",
  "TURTLE",
  "SNAKE",
  "LIZARD",
  "GUINEA_PIG",
  "HORSE",
  "GOAT",
] as const;

const PetTypeSchema = pgEnum("pet_type", PetType);

export const vetTable = pgTable("vet", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  allowedPetTypes: PetTypeSchema("type")
    .array()
    .notNull()
    .default(sql`'{}'::pet_type[]`),
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
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  type: PetTypeSchema("type").notNull().default("UNKNOWN"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Pet = typeof petTable.$inferSelect;
export type NewPet = typeof petTable.$inferInsert;
export const insertPetSchema = createInsertSchema(petTable);

export const serviceTable = pgTable("service", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  applicablePetType: text("applicable_pet_type", {
    enum: PetType,
  }).notNull(),
  price: integer("price").notNull().default(10),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Service = typeof serviceTable.$inferSelect;
export type NewService = typeof serviceTable.$inferInsert;
export const insertServiceSchema = createInsertSchema(serviceTable);

export const appointmentTable = pgTable("appointment", {
  id: serial("id").notNull().primaryKey(),
  petId: integer("pet_id")
    .notNull()
    .references(() => petTable.id),
  vetId: integer("vet_id")
    .notNull()
    .references(() => userTable.id),
  serviceId: integer("service_id")
    .notNull()
    .references(() => serviceTable.id),
  userId: integer("user_id")
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
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => userTable.id),
  token: varchar("token", { length: 256 }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Session = typeof sessionTable.$inferSelect;
