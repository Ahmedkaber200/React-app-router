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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { supabase } from "@/client/supabase-client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  contact: z.string().min(10, { message: "Contact must be at least 10 digits" }),
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

type Tasks = {
  name: string;
  email: string;
  contact: string;
  address: string;
};

export function CustomerForm({
  mode = "create",
  initialData,
}: CustomerFormProps) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [newTask, setNewTask] = useState<Tasks>({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

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

  // 🟢 Set form values when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        contact: initialData.contact,
        address: initialData.address,
      });
      setNewTask(initialData); // Local state update
    }
  }, [mode, initialData, form]);

  // 🟢 Supabase submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Values:", values); // 👈 log form values
    setIsButtonDisabled(true);

    // try {
    //   if (mode === "create") {
    //     const { error } = await supabase.from("customers").insert(values).single();

    //     if (error) throw error;

    //     console.log("✅ Customer created successfully in DB"); // 👈 success log

    //     toast.success("✅ Customer created successfully!");
    //   } else if (mode === "edit" && initialData?.id) {
    //     const { error } = await supabase
    //       .from("customers")
    //       .update(values)
    //       .eq("id", initialData.id);

    //     if (error) throw error;

    //     toast.success("✏️ Customer updated successfully!");
    //   }

    //   form.reset();
    //   navigate("/customers");
    // } catch (error: any) {
    //   console.error("Supabase Error:", error.message);
    //   toast.error(error.message || "Something went wrong!");
    //   setIsButtonDisabled(false);
    // }
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
            {/* 🟢 Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟢 Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      {...field}
                     
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟢 Contact */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟢 Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submitting..." : "Submit"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/customers")}
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
