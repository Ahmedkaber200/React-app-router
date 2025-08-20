import React from "react";
import type { Route } from "./+types/index";
import { get, del, post } from "@/client/api-client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useRevalidator } from "react-router";
import { cn } from "@/lib/utils";
import { EditIcon, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/confirm-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// export async function clientLoader() {
//   const data = await get(`/customers/`);
//   return data || [];
// }



const customer = ({ loaderData }: Route.ComponentProps) => {
  const revalidator = useRevalidator();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const queryClient = useQueryClient();
const { data = [], isLoading } = useQuery<any>({
    queryKey: ["customer"],
    queryFn: () => get(`/customers`),
  });
  const { mutate: deleteCustomer, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await del(`/customers/${id}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      setOpen(false);
      setSelectedId(null);
    },
    onError: () => {
      toast.error("Failed to delete customer.");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link to="/customers/create" className={cn(buttonVariants({ variant: "primary" }))}>
          Add Customer
        </Link>
        </div>
      <Table>
        <TableCaption>A list of your customers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(data as any).map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Link to={`/customers/${item.id}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <EditIcon className="h-4 w-4" />
                  </Link>

                  <Button
                  onClick={()=>{
                    setOpen(true);
                    setSelectedId(item.id);
                  }} variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmationModal
      isLoading={isPending}
        open={open}
        onCancel={setOpen}
        onClick={() => {
          deleteCustomer(selectedId!);
        }}
      />
    </div>
  );
};

export default customer;
