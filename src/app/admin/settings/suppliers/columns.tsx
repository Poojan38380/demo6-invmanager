"use client";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Vendor } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export const SupplierColumns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "companyName",
    id: "company-name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => {
      const companyName = row.original.companyName;
      const supplierId = row.original.id;
      return (
        <Link
          prefetch={false}
          href={`/admin/transactions/supplier/${supplierId}`}
          className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
        >
          <span className="font-medium">{companyName}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "",
    id: "edit-button",

    cell: ({ row }) => {
      const supplierId = row.original.id;
      return (
        <TooltipWrapper content="Edit details">
          <Button asChild size={"icon"} variant={"ghost"}>
            <Link
              prefetch={false}
              href={`/admin/settings/suppliers/${supplierId}`}
            >
              <Edit />
            </Link>
          </Button>
        </TooltipWrapper>
      );
    },
  },
  {
    accessorKey: "contactName",
    id: "contact-name",
    header: "Contact Name",
  },

  {
    accessorKey: "email",
    id: "email",
    header: "E-mail",
    cell: ({ row }) => {
      const email = row.original.email;
      if (email)
        return (
          <Link prefetch={false} href={`mailto:${email}`}>
            <Badge variant="secondary" className="font-normal">
              <Mail className="h-3 w-3 mr-1" />
              {email}
            </Badge>
          </Link>
        );
    },
  },
  {
    accessorKey: "contactNumber",
    id: "contact-number",
    header: "Number",
    cell: ({ row }) => {
      const contactNumber = row.original.contactNumber;
      if (contactNumber)
        return (
          <Link prefetch={false} href={`tel:${contactNumber}`}>
            <Badge variant="outline" className="font-normal">
              <Phone className="h-3 w-3 mr-1" />
              {contactNumber}
            </Badge>
          </Link>
        );
    },
  },
  {
    accessorKey: "address",
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      if (address)
        return (
          <Badge variant="secondary" className="font-normal max-768:hidden">
            <MapPin className="h-3 w-3 mr-1 " />
            {address}
          </Badge>
        );
    },
  },
];
