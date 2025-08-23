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
import { useMutation } from "@tanstack/react-query";
import { post, put } from "@/client/api-client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// ✅ Product form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(5, { message: "Description is required" }),
  price: z.string().min(1, { message: "Price is required" }),
});

type ProductFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id?: number;
    name: string;
    description: string;
    price: string;
  };
};

export function ProductForm({
  mode = "create",
  initialData,
}: ProductFormProps) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  // Set form values when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
      });
    }
  }, [mode, initialData, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      mode === "create"
        ? post("/products", data)
        : put(`/products/${initialData?.id}`, data),
    onSuccess: (response: any) => {
      const successMessage =
        mode === "create"
          ? response?.message || "Product created successfully!"
          : response?.message || "Product updated successfully!";

      toast.success(successMessage, {
        duration: 7000,
      });

      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsButtonDisabled(true);

    mutate(values, {
      onSuccess: () => {
        navigate("/products");
      },
      onError: (error) => {
        console.error(`Failed to ${mode} product:`, error);
        setIsButtonDisabled(false);
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Add Product" : "Edit Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
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
                onClick={() => navigate("/products")}
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
