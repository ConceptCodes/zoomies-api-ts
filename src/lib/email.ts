import { Resend } from "resend";
import { env } from "@lib/env";
import path from "path";
import fs from "fs";
import xss from "xss";

const resend = new Resend(env.RESEND_API_KEY);

type Data = Record<string, string>;

export type VerifyEmailData = {
  code: string;
};

export type WelcomeEmailData = {
  name: string;
};

export type ResetPasswordEmailData = VerifyEmailData;

export type AppointmentReminderEmailData = {
  name: string;
  appointmentDate: string;
  serviceName: string;
  petName?: string;
  vetName?: string;
};

type Email = {
  [key: string]: {
    subject: string;
    component: (data: Data) => string;
  };
};

const loadTemplate = (name: string, args: Record<string, string>): string => {
  const template = fs.readFileSync(
    path.join(__dirname, "..", "emails", `${name}.html`),
    "utf8"
  );
  return template.replace(/{{([^{}]*)}}/g, (a, b) => {
    const value = args[b];
    return typeof value === "string" ? value : a;
  });
};

const templates: Email = {
  welcome: {
    subject: "Welcome to Zoomies",
    component: (data) => {
      return loadTemplate("welcome", data);
    },
  },
  verifyEmail: {
    subject: "Verify your email",
    component: (data) => {
      return loadTemplate("verify-email", data);
    },
  },
  appointmentReminder: {
    subject: "Your appointment is coming up",
    component: (data) => {
      return loadTemplate("appointment-reminder", data);
    },
  },
  resetPassword: {
    subject: "Reset your password",
    component: (data) => {
      return loadTemplate("reset-password", data);
    },
  },
};

export type Template = keyof typeof templates;

export async function sendEmail(email: string, template: Template, data: Data) {
  try {
    const subject = templates[template].subject;
    let html = templates[template].component(data);
    html = xss(html);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }

    const res = await resend.emails.send({
      from: "Zoomies <support@ekaaro.app>",
      to: [email],
      subject,
      html,
    });

    console.log(`Email sent to ${email}: ${res.id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkEmailHealth() {
  try {
    const { data } = await resend.domains.list();
    return data.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
