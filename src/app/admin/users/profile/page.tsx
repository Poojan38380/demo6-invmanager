import React from "react";
import { Card } from "@/components/ui/card";
import UserInfo from "@/app/admin/users/profile/_components/UserInfo";

export default function UserProfilePage() {
  return (
    <Card className="border-none shadow-none bg-background">
      <UserInfo />
    </Card>
  );
}
