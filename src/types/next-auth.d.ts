import { CustomUser } from "@/lib/auth";
import "next-auth";

declare module "next-auth" {
  interface User extends CustomUser {}
  interface Session {
    user: CustomUser;
  }
}
