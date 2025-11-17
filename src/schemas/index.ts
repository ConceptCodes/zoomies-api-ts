import { z } from "zod";

import {
  insertUserSchema,
  insertPetSchema,
  insertServiceSchema,
  insertAppointmentSchema,
  insertVetSchema,
  insertPaymentSchema,
  insertSubscriptionSchema,
  insertTransactionSchema,
} from "@lib/db/schema";
import { notificationChannels } from "@lib/notifications/types";

// Auth
export const loginSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

export const registerSchema = insertUserSchema
  .pick({
    email: true,
    password: true,
    fullName: true,
    phoneNumber: true,
  })
  .required();

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8),
});

// Profile
const notificationChannelEnum = z.enum([...notificationChannels]);

export const notificationPreferencesSchema = z.object({
  channels: z.array(notificationChannelEnum).nonempty(),
  upcomingAppointments: z.object({
    enabled: z.boolean(),
  }),
});

export const updateProfileSchema = z
  .object({
    fullName: z.string().max(255).optional(),
    notificationPreferences: notificationPreferencesSchema.optional(),
  })
  .refine(
    (data) =>
      data.fullName !== undefined || data.notificationPreferences !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

export const addPetSchema = insertPetSchema
  .pick({
    ownerId: true,
    name: true,
    type: true,
    age: true,
  })
  .partial({
    ownerId: true,
  });

// Pet
export const getOnePetSchema = z.object({
  id: insertPetSchema.shape.id,
});

export const getByIdPetSchema = z.object({
  id: insertPetSchema.shape.id,
});

export const getByTypePetSchema = z.object({
  type: insertPetSchema.shape.type,
});

export const updatePetSchema = insertPetSchema
  .pick({
    id: true,
    ownerId: true,
    name: true,
    type: true,
    age: true,
  })
  .partial({
    ownerId: true,
  });

// Vet
export const getOneVetSchema = z.object({
  id: insertVetSchema.shape.userId,
});

export const createVetSchema = insertVetSchema.pick({
  userId: true,
  allowedPetTypes: true,
  startHour: true,
  endHour: true,
  days: true,
});

export const updateVetSchema = z
  .object({
    allowedPetTypes: insertVetSchema.shape.allowedPetTypes.optional(),
    startHour: insertVetSchema.shape.startHour.optional(),
    endHour: insertVetSchema.shape.endHour.optional(),
    days: insertVetSchema.shape.days.optional(),
  })
  .refine(
    (data) =>
      data.allowedPetTypes !== undefined ||
      data.startHour !== undefined ||
      data.endHour !== undefined ||
      data.days !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

// Service
export const updateServiceSchema = insertServiceSchema.pick({
  id: true,
  name: true,
  description: true,
  price: true,
});

export const getOneServiceSchema = insertServiceSchema.pick({
  id: true,
});

// Appointment

// NOTE: what can you change after you create an appointment?
export const createAppointmentSchema = insertAppointmentSchema.omit({
  userId: true,
});

export const updateAppointmentSchema = insertAppointmentSchema.pick({
  id: true,
  petId: true,
  serviceId: true,
  date: true,
});

// Payment Schemas
export const createPaymentSchema = insertPaymentSchema.pick({
  userId: true,
  appointmentId: true,
  amount: true,
  currency: true,
});

export const createSubscriptionSchema = insertSubscriptionSchema.pick({
  userId: true,
  polarProductId: true,
  polarSubscriptionId: true,
  status: true,
});

export const createTransactionSchema = insertTransactionSchema.pick({
  paymentId: true,
  type: true,
  amount: true,
  currency: true,
  status: true,
  metadata: true,
});

export const updatePaymentSchema = insertPaymentSchema.pick({
  id: true,
  status: true,
});

export const updateSubscriptionSchema = insertSubscriptionSchema.pick({
  id: true,
  status: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
});

export const getOneAppointmentSchema = insertAppointmentSchema.pick({
  id: true,
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type NotificationPreferencesSchema = z.infer<
  typeof notificationPreferencesSchema
>;

export type GetOnePetSchema = z.infer<typeof getOnePetSchema>;
export type GetByTypePetSchema = z.infer<typeof getByTypePetSchema>;
export type CreatePetSchema = z.infer<typeof addPetSchema>;
export type UpdatePetSchema = z.infer<typeof updatePetSchema>;

export type CreateVetSchema = z.infer<typeof createVetSchema>;
export type UpdateVetSchema = z.infer<typeof updateVetSchema>;

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
export type CreateServiceSchema = z.infer<typeof insertServiceSchema>;

export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;
export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
export type InsertAppointmentSchema = z.infer<typeof insertAppointmentSchema>;
