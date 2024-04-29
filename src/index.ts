import App from "@/app";
import HealthRoute from "@route/health";
import AuthRoute from "@route/auth";
import PetRoute from "@route/pet";
import ProfileRoute from "@route/profile";
import ServiceRoute from "@route/service";
import AppointmentRoute from "@route/appointment";

export const app = new App([
  new HealthRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PetRoute(),
  new ServiceRoute(),
  new AppointmentRoute(),
]);

app.listen();
