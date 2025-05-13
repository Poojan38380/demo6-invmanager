import React from "react";
import { getCachedUsers } from "./_actions/user-actions";
import UserList from "./_components/user-list";
import { Card } from "@/components/ui/card";

export default async function UsersPage() {
  const users = await getCachedUsers();

  return (
    <Card className="border-none shadow-none bg-background">
      <UserList initialUsers={users} />
    </Card>
  );
}
