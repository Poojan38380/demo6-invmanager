import "next-auth";
import { CustomUser } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}
