"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export function BreadCrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname!
    .split("/")
    .filter((segment) => segment !== "")
    .slice(1); // Exclude the "admin" base route

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/admin/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize the segment

    return (
      <BreadcrumbItem key={href} className="flex items-center">
        <BreadcrumbLink asChild>
          <Link href={href} prefetch={false}>
            {label}
          </Link>
        </BreadcrumbLink>
        {index < pathSegments.length - 1 && "/"}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex">
        <BreadcrumbItem className="flex items-center">
          <BreadcrumbLink asChild>
            <Link prefetch={false} href="/admin">
              Admin
            </Link>
          </BreadcrumbLink>
          {pathSegments.length > 0 && "/"}
        </BreadcrumbItem>
        {breadcrumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
