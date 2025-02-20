"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "@/components/ui/data-table/data-table-column-visibility";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  displayProductName?: boolean;
}

export function TransactionsDataTable<TData, TValue>({
  columns,
  data,
  displayProductName = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      product: displayProductName ? true : false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // New filter states
  const [userFilter, setUserFilter] = React.useState<string | null>(null);
  const [customerSupplierFilter, setCustomerSupplierFilter] = React.useState<
    string | null
  >(null);
  const [actionFilter, setActionFilter] = React.useState<string | null>(null);
  const [productFilter, setProductFilter] = React.useState<string | null>(null);

  const filteredData = React.useMemo(() => {
    return data.filter((transaction: any) => {
      const matchesUser = userFilter
        ? transaction.user.username === userFilter
        : true;
      const matchesCustomerSupplier = customerSupplierFilter
        ? transaction.customer?.companyName === customerSupplierFilter ||
          transaction.vendor?.companyName === customerSupplierFilter
        : true;
      const matchesAction = actionFilter
        ? transaction.action === actionFilter
        : true;
      const matchesProduct = productFilter
        ? transaction.product.name === productFilter
        : true;

      return (
        matchesUser &&
        matchesCustomerSupplier &&
        matchesAction &&
        matchesProduct
      );
    });
  }, [data, userFilter, customerSupplierFilter, actionFilter, productFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableColumns = [
        "product",
        "username",
        "customer-supplier",
        "note",
      ];
      return searchableColumns.some((col) => {
        const value = row.getValue(col) as string;
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      });
    },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Extract unique values for filters
  const uniqueUsers = Array.from(
    new Set(data.map((transaction: any) => transaction.user.username))
  );
  const uniqueCustomerSuppliers = Array.from(
    new Set(
      data.flatMap((transaction: any) =>
        [
          transaction.customer?.companyName,
          transaction.vendor?.companyName,
        ].filter(Boolean)
      )
    )
  );
  const uniqueActions = Array.from(
    new Set(data.map((transaction: any) => transaction.action))
  );
  const uniqueProducts = Array.from(
    new Set(data.map((transaction: any) => transaction.product.name))
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-4">
        <Button
          onClick={() => {
            setUserFilter(null);
            setCustomerSupplierFilter(null);
            setActionFilter(null);
            setProductFilter(null);
          }}
          variant="outline"
          className="ml-2 rounded-full"
        >
          Clear Filters
        </Button>
        <Select onValueChange={setUserFilter}>
          <SelectTrigger className="w-min rounded-full ">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            {uniqueUsers.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setCustomerSupplierFilter}>
          <SelectTrigger className="w-min rounded-full">
            <SelectValue placeholder="Customer/Supplier" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCustomerSuppliers.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setActionFilter}>
          <SelectTrigger className="w-min rounded-full">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            {uniqueActions.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setProductFilter}>
          <SelectTrigger className="w-min rounded-full">
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            {uniqueProducts.map((product) => (
              <SelectItem key={product} value={product}>
                {product}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between pb-4 gap-2">
        <Input
          placeholder="Search transactions..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-52 rounded-full bg-card shadow-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} product(s) selected.
          </div>
        )}
      </div>
      <div className="rounded-2xl border bg-card shadow-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
