import React from "react";
import type { Route } from "./+types/index";
import { get, del } from "@/client/api-client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { EditIcon, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/confirm-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Product = ({ loaderData }: Route.ComponentProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch Products
  const { data = [], isLoading } = useQuery<any>({
    queryKey: ["products"],
    queryFn: () => get(`/products`),
  });

  // Delete Product
  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await del(`/products/${id}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setSelectedId(null);
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/create" className={cn(buttonVariants({ variant: "primary" }))}>
          Add Product
        </Link>
      </div>

      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(data as any).map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Link to={`/products/${item.id}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                    <EditIcon className="h-4 w-4" />
                  </Link>

                  <Button
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(item.id);
                    }}
                    variant="destructive"
                    size="icon"
                  >
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
          deleteProduct(selectedId!);
        }}
      />
    </div>
  );
};

export default Product;
