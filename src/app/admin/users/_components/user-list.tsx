"use client";

import React, { useState, useEffect } from "react";
import { UserWithCounts } from "@/types/dataTypes";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftRight, Calendar, Package, PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import BackButton from "../../_components/sidebar/back-button";

interface UserListProps {
  initialUsers: UserWithCounts[];
}

export default function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<UserWithCounts[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filteredUsers = initialUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  }, [searchTerm, initialUsers]);

  return (
    <>
      <CardHeader className="py-4">
        <BackButton title="All Users" />
        <div className="flex gap-2 justify-between">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-60 rounded-full bg-card shadow-sm"
          />
          <Button asChild className="rounded-full shadow-sm">
            <Link href="/admin/users/new" prefetch={false}>
              <PlusIcon size={16} />
              Add user
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-768:px-0">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    prefetch={false}
                    href={`/admin/transactions/user/${user.id}`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profilePic} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <CardTitle className="text-lg">
                      <Link
                        prefetch={false}
                        href={`/admin/transactions/user/${user.id}`}
                        className="hover:underline"
                      >
                        {user.username}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge variant={user.isArchived ? "secondary" : "default"}>
                  {user.isArchived ? "Archived" : "Active"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link
                  prefetch={false}
                  href={`/admin/transactions/user/${user.id}`}
                  className="flex items-center gap-2 text-muted-foreground hover:font-semibold hover:underline"
                >
                  <ArrowLeftRight size={16} />
                  <span className="">
                    {user._count.transactions || 0} transactions
                  </span>
                </Link>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package size={16} />
                  <span>{user._count.products || 0} products</span>
                </div>
                <div className="flex col-span-2 items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span>Joined {formatDateYYMMDDHHMM(user.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </>
  );
}
