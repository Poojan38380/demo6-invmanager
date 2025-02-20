"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the Transaction type based on your Prisma schema
type Transaction = {
  id: string;
  createdAt: Date;
  action: "CREATED" | "DELETED" | "INCREASED" | "DECREASED";
  stockBefore: number;
  stockChange: number;
  stockAfter: number;
  note?: string | null;
  productId: string;
  userId: string;
  customerId?: string | null;
  vendorId?: string | null;
  productVariantId?: string | null;
  // Include related data
  product: { name: string; id: string };
  user: { username: string; id: string };
  customer?: { companyName: string; id: string } | null;
  vendor?: { companyName: string; id: string } | null;
  productVariant?: { variantName: string } | null;
};

type TransactionExportProps = {
  transactions: Transaction[];
  products: { id: string; name: string }[];
  customers: { id: string; companyName: string }[];
  vendors: { id: string; companyName: string }[];
  users: { id: string; username: string }[];
};

const TransactionExport = ({
  transactions,
  products,
  customers,
  vendors,
  users,
}: TransactionExportProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    );
  }, [productSearch, products]);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.companyName
          .toLowerCase()
          .includes(customerSearch.toLowerCase())
      )
    );
  }, [customerSearch, customers]);

  useEffect(() => {
    setFilteredVendors(
      vendors.filter((vendor) =>
        vendor.companyName.toLowerCase().includes(vendorSearch.toLowerCase())
      )
    );
  }, [vendorSearch, vendors]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(userSearch.toLowerCase())
      )
    );
  }, [userSearch, users]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesDate =
      (!dateRange.from || new Date(transaction.createdAt) >= dateRange.from) &&
      (!dateRange.to || new Date(transaction.createdAt) <= dateRange.to);

    const matchesProduct =
      selectedProducts.length === 0 ||
      selectedProducts.includes(transaction.productId);

    const matchesCustomer =
      selectedCustomers.length === 0 ||
      (transaction.customerId &&
        selectedCustomers.includes(transaction.customerId));

    const matchesVendor =
      selectedVendors.length === 0 ||
      (transaction.vendorId && selectedVendors.includes(transaction.vendorId));

    const matchesUser =
      selectedUsers.length === 0 || selectedUsers.includes(transaction.userId);

    return (
      matchesDate &&
      matchesProduct &&
      matchesCustomer &&
      matchesVendor &&
      matchesUser
    );
  });

  const clearAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedProducts([]);
    setSelectedCustomers([]);
    setSelectedVendors([]);
    setSelectedUsers([]);
  };

  const downloadCSV = () => {
    const headers = [
      "Date",
      "Action",
      "Product",
      "Variant",
      "Stock Before",
      "Stock Change",
      "Stock After",
      "User",
      "Customer",
      "Vendor",
      "Note",
    ];

    const csvData = filteredTransactions.map((t) => [
      format(new Date(t.createdAt), "yyyy-MM-dd HH:mm:ss"),
      t.action,
      t.product.name,
      t.productVariant?.variantName || "-",
      t.stockBefore,
      t.stockChange,
      t.stockAfter,
      t.user.username,
      t.customer?.companyName || "-",
      t.vendor?.companyName || "-",
      t.note || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...csvData].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `transactions-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelection = (
    id: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const setToday = () => {
    const today = new Date();
    setDateRange({ from: today, to: today });
  };

  const setLast7Days = () => {
    const today = new Date();
    setDateRange({ from: subDays(today, 7), to: today });
  };

  const setLast14Days = () => {
    const today = new Date();
    setDateRange({ from: subDays(today, 14), to: today });
  };

  const setLast30Days = () => {
    const today = new Date();
    setDateRange({ from: subDays(today, 30), to: today });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Export Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-max">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange({ from: undefined, to: undefined });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="grid grid-cols-2 gap-2 p-3 border-b">
                  <Badge
                    variant={"outline"}
                    onClick={setToday}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Today
                  </Badge>
                  <Badge
                    variant={"outline"}
                    onClick={setLast7Days}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Last 7 Days
                  </Badge>
                  <Badge
                    variant={"outline"}
                    onClick={setLast14Days}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Last 14 Days
                  </Badge>
                  <Badge
                    variant={"outline"}
                    onClick={setLast30Days}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Last 30 Days
                  </Badge>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) =>
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    })
                  }
                  numberOfMonths={1}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Select Products</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onChange={() =>
                          toggleSelection(
                            product.id,
                            selectedProducts,
                            setSelectedProducts
                          )
                        }
                      />
                      <label htmlFor={`product-${product.id}`}>
                        {product.name}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Select Customers</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`customer-${customer.id}`}
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() =>
                          toggleSelection(
                            customer.id,
                            selectedCustomers,
                            setSelectedCustomers
                          )
                        }
                      />
                      <label htmlFor={`customer-${customer.id}`}>
                        {customer.companyName}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Select Vendors</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Search vendors..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`vendor-${vendor.id}`}
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() =>
                          toggleSelection(
                            vendor.id,
                            selectedVendors,
                            setSelectedVendors
                          )
                        }
                      />
                      <label htmlFor={`vendor-${vendor.id}`}>
                        {vendor.companyName}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Select Users</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() =>
                          toggleSelection(
                            user.id,
                            selectedUsers,
                            setSelectedUsers
                          )
                        }
                      />
                      <label htmlFor={`user-${user.id}`}>{user.username}</label>
                    </div>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((productId) => (
              <Badge key={productId} variant="secondary">
                {products.find((p) => p.id === productId)?.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-secondary-foreground"
                  onClick={() =>
                    setSelectedProducts(
                      selectedProducts.filter((id) => id !== productId)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedCustomers.map((customerId) => (
              <Badge key={customerId} variant="secondary">
                {customers.find((c) => c.id === customerId)?.companyName}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-secondary-foreground"
                  onClick={() =>
                    setSelectedCustomers(
                      selectedCustomers.filter((id) => id !== customerId)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedVendors.map((vendorId) => (
              <Badge key={vendorId} variant="secondary">
                {vendors.find((v) => v.id === vendorId)?.companyName}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-secondary-foreground"
                  onClick={() =>
                    setSelectedVendors(
                      selectedVendors.filter((id) => id !== vendorId)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedUsers.map((userId) => (
              <Badge key={userId} variant="secondary">
                {users.find((u) => u.id === userId)?.username}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-secondary-foreground"
                  onClick={() =>
                    setSelectedUsers(
                      selectedUsers.filter((id) => id !== userId)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div>
            <Button
              onClick={clearAllFilters}
              variant="secondary"
              className="rounded-full"
            >
              Clear All Filters
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {filteredTransactions.length} transactions found
            </p>
            <Button onClick={downloadCSV}>Download CSV</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionExport;
