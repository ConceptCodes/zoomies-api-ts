import { Resend } from "resend";
import { env } from "@lib/env";
import path from "path";
import fs from "fs";

const resend = new Resend(env.RESEND_API_KEY);

const getHtml = (name: string, data?: Record<string, unknown>) => {
  const template = fs.readFileSync(
    path.join(__dirname, "..", "emails", `${name}.html`),
    "utf8"
  );
  return template.replace(/{{([^{}]*)}}/g, (a, b) => {
    const r = data[b];
    return typeof r === "string" || typeof r === "number" ? r : a;
  });
};

const templates = {
  welcome: {
    subject: "Welcome to Acme",
    component: getHtml("welcome"),
  },
  resetPassword: {
    subject: "Reset your password",
    component: getHtml("reset-password"),
  },
};

export async function sendEmail(
  email: string,
  template: keyof typeof templates
) {
  try {
    await resend.emails.send({
      from: "Zoomies <support@zoomies.dev>",
      to: [email],
      subject: templates[template].subject,
      html: templates[template].component,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
