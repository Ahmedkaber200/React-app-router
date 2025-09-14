// "use client";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useRouter, useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Check, FileText, User, Package, AlertCircle } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import MultipleSelector from "@/components/ui/multi-select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { toast } from "sonner";

// // 👇 import supabase client
// import { supabase } from "@/client/supabase-client";
// // import { useStore } from "@/app/hooks/usestore";

// const formSchema = z.object({
//   customer_id: z.number().min(1, { message: "Customer is required" }),
//   product_details: z
//     .array(
//       z.object({
//         id: z.number(),
//         name: z.string(),
//         price: z.number(),
//       })
//     )
//     .min(1, { message: "At least one product is required" }),
//   status: z.string().min(1, { message: "Status is required" }),
// });

// type InvoiceFormProps = {
//   mode?: "create" | "edit";
//   initialData?: {
//     id?: number;
//     customer_id: number;
//     product_details: Array<{ id: number; name: string; price: number }>;
//     total_amount?: number;
//     status: "pending" | "paid";
//   };
// };

// export function InvoiceForm({ mode = "create", initialData }: InvoiceFormProps) {
//   const router = useRouter();
//   const { id } = useParams();
//   const { customers } = useStore();

//   const [isButtonDisabled, setIsButtonDisabled] = useState(false);
//   const [total, setTotal] = useState(0);

//   // 🔹 Fetch products from Supabase
//   const { data: products = [], isPending: loading } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const { data, error } = await supabase.from("products").select("*");
//       if (error) throw error;
//       return data;
//     },
//   });

//   // 🔹 Fetch invoice data from Supabase (only in edit mode)
//   const { data: invoiceData } = useQuery({
//     queryKey: ["invoice", id],
//     queryFn: async () => {
//       if (mode !== "edit") return null;
//       const { data, error } = await supabase
//         .from("invoices")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw error;
//       return data;
//     },
//     enabled: mode === "edit",
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       customer_id: initialData?.customer_id ?? 0,
//       product_details: initialData?.product_details ?? [],
//       status: initialData?.status ?? "",
//     },
//   });

//   useEffect(() => {
//     if (mode === "edit" && initialData) {
//       form.setValue("customer_id", initialData.customer_id);
//       form.setValue("product_details", initialData.product_details);
//       form.setValue("status", initialData.status);
//       setTotal(initialData.total_amount || 0);
//     }
//   }, [mode, initialData, form]);

//   function calculateTotal(products: any[]) {
//     const totalAmount = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
//     setTotal(totalAmount);
//   }

//   const { mutate, isPending } = useMutation({
//     mutationFn: async (values: z.infer<typeof formSchema>) => {
//       const payload = { ...values, total_amount: total };

//       if (mode === "create") {
//         const { error } = await supabase.from("invoices").insert(payload);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase
//           .from("invoices")
//           .update(payload)
//           .eq("id", initialData?.id);
//         if (error) throw error;
//       }
//     },
//     onSuccess: () => {
//       toast.success(
//         mode === "create" ? "Invoice created successfully!" : "Invoice updated successfully!"
//       );
//       form.reset();
//       router.push("/invoices");
//       router.refresh();
//     },
//     onError: (error) => {
//       console.error(`Failed to ${mode} invoice:`, error);
//       setIsButtonDisabled(false);
//       toast.error("Something went wrong!");
//     },
//   });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     setIsButtonDisabled(true);
//     mutate(values);
//   };

//   return (
//     <div className="w-full">
//       <Card className="w-full border-0 shadow-lg">
//         <CardHeader>
//           <CardTitle>
//             {mode === "create" ? "Create Invoice" : "Update Invoice"}
//           </CardTitle>
//           <CardDescription>
//             Fill the form to {mode === "create" ? "create" : "update"} invoice
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* Customer */}
//               <FormField
//                 control={form.control}
//                 name="customer_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Customer</FormLabel>
//                     <Select
//                       onValueChange={(value) => field.onChange(Number(value))}
//                       value={field.value as any}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select customer" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {customers?.map((c: any) => (
//                           <SelectItem key={c.id} value={c.id}>
//                             {c.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Product Details */}
//               <FormField
//                 control={form.control}
//                 name="product_details"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Products</FormLabel>
//                     <FormControl>
//                       <MultipleSelector
//                         options={
//                           (products as any)?.map((p: any) => ({
//                             value: p.id,
//                             label: `${p.name} - Rs ${p.price}`,
//                           })) || []
//                         }
//                         value={
//                           field.value?.map((p: any) => ({
//                             value: p.id,
//                             label: `${p.name} - Rs ${p.price}`,
//                           })) || []
//                         }
//                         onChange={(values) => {
//                           let prod = (products as any)
//                             ?.filter((p: any) =>
//                               values.some((f) => f.value == p.id)
//                             )
//                             .map((e: any) => ({
//                               id: e.id,
//                               name: e.name,
//                               price: Number(e.price),
//                             }));
//                           calculateTotal(prod);
//                           field.onChange(prod);
//                         }}
//                         placeholder="Select products"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Status */}
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <RadioGroup
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       className="flex gap-4"
//                     >
//                       <FormItem>
//                         <FormControl>
//                           <RadioGroupItem value="pending" id="pending" />
//                         </FormControl>
//                         <FormLabel htmlFor="pending">Pending</FormLabel>
//                       </FormItem>
//                       <FormItem>
//                         <FormControl>
//                           <RadioGroupItem value="paid" id="paid" />
//                         </FormControl>
//                         <FormLabel htmlFor="paid">Paid</FormLabel>
//                       </FormItem>
//                     </RadioGroup>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Total */}
//               <h2 className="text-xl font-semibold">Total: Rs {total}</h2>

//               <div className="flex gap-4 justify-end">
//                 <Button
//                   isLoading={isPending || isButtonDisabled}
//                   type="submit"
//                   className="w-36"
//                 >
//                   {mode === "create" ? "Create" : "Update"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/invoices")}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
