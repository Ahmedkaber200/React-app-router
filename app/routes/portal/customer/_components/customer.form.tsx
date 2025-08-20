import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { post, put, get } from "@/client/api-client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate  } from "react-router";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  contact: z
    .string()
    .min(10, { message: "Contact must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address is required" }),
});

type CustomerFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id?: number;
    name: string;
    email: string;
    contact: string;
    address: string;
  };
};

export function CustomerForm({
  mode = "create",
  initialData,
}: CustomerFormProps) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      address: "",
    },
  });

  // Set form values when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        contact: initialData.contact,
        address: initialData.address,
      });
    }
  }, [mode, initialData, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      mode === "create"
        ? post("/customers", data)
        : put(`/customers/${initialData?.id}`, data),
    onSuccess: (response: any) => {
      const successMessage =
        mode === "create"
          ? response?.message || "Customer created successfully!"
          : response?.message || "Customer updated successfully!";

      toast.success(successMessage, {
        duration: 7000, // 🕒 7 seconds
      });

      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsButtonDisabled(true);

    mutate(values, {
      onSuccess: () => {
         navigate("/customers");
      },
      onError: (error) => {
        console.error(`Failed to ${mode} customer:`, error);
        setIsButtonDisabled(false);
      },
    });
  };



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Add Customer" : "Edit Customer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      {...field}
                      type="email"
                      // disabled={mode === "edit"} // Disable email in edit mode
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isButtonDisabled}
              >
                {isPending || isButtonDisabled ? "Submitting..." : "Submit"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>navigate("/customers")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
