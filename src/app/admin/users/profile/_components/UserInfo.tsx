"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import UserForm from "./UserForm";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-muted-foreground">Not signed in</p>
      </div>
    );
  }

  const { username, profilePic, email, id } = session.user;

  return (
    <div className="flex flex-col gap-6 my-6 justify-center items-center min-h-[200px]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePic} alt={username || "User"} />
              <AvatarFallback>
                {username ? username.substring(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-center">
              <h3 className="text-xl font-semibold">{username}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <UserForm userId={id} />
    </div>
  );
}
