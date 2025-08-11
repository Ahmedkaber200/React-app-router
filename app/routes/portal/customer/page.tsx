import React from "react";
import type { Route } from "./+types/page";
import { get, del, post } from "@/client/api-client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { EditIcon, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/confirm-modal";

export async function clientLoader() {
  const data = await get(`/customers/`);
  return data || [];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (!id) return { success: false, error: "No ID provided" };

  const res = await del(`/customers/${id}`);
  console.log(res);
  return { success: true };
}

const customer = ({ loaderData }: Route.ComponentProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  return (
    <div>
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
          {(loaderData as any).map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Link
                    to={`/customers/${item.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" })
                    )}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Link>
                  <form method="delete">
                    <input type="hidden" name="id" value={item.id} />
                    <Button variant="destructive" size="icon" type="submit">
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <form method="post">
         <input type="hidden" name="id" value={selectedId ?? ""} />
        <ConfirmationModal open={open} onCancel={setOpen} />
      </form> */}
    </div>
  );
};

export default customer;
