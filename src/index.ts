import App from "@/app";
import HealthRoute from "@route/health";
import AuthRoute from "@route/auth";
import PetRoute from "@route/pet";
import ProfileRoute from "@route/profile";
import ServiceRoute from "./routes/service";
import AppointmentRoute from "./routes/appointment";

export const app = new App([
  new HealthRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PetRoute(),
  new ServiceRoute(),
  new AppointmentRoute(),
]);

app.listen();
