"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Building2, User, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addCustomer } from "../_actions/cust-supp-actions";

export default function CustomerForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactNumber: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(`Creating customer`); // Changed from "Updating stock"

    try {
      const result = await addCustomer(formData);

      if (result.success) {
        router.push("/admin/settings/customers");
        toast.success("Customer created successfully.", { id: loadingToast });
      } else {
        toast.error(result.error || "Failed to create customer", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const formFields = [
    {
      id: "companyName",
      label: "Company Name",
      icon: Building2,
      required: true,
    },
    { id: "contactName", label: "Contact Name", icon: User },
    { id: "contactNumber", label: "Contact Number", icon: Phone },
    { id: "email", label: "Email", icon: Mail, type: "email" },
    { id: "address", label: "Address", icon: MapPin },
  ];
  return (
    <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center space-x-2">
                <field.icon className="w-4 h-4" />
                <span>
                  {field.label}
                  {field.required && " *"}
                </span>
              </Label>
              <Input
                id={field.id}
                type={field.type || "text"}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={loading || !formData.companyName}
          className="w-full"
        >
          {loading ? "Creating..." : "Create customer"}
        </Button>
      </CardFooter>
    </form>
  );
}
