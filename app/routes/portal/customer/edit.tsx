import React from "react";
import { CustomerForm } from "./_components/customer.form";
import type { Route } from "./+types";
import { del, get, supabase } from "@/client/supabase-client";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loding";
// import { get } from "@/client/api-client";

// -------------------------------
// Type for Customer (adjust according to your API)
type Customer = {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  // add other fields...
};

// -------------------------------
// Loader (CSR fetching)
export async function loader({ params }: Route.LoaderArgs) {
  const id = (params as any).id as string;
  return { id };
}

// -------------------------------
// Page Component
const Page = ({ loaderData }: Route.ComponentProps) => {
  if (!(loaderData as any)?.id) {
    return <div className="text-red-500">Customer not found or failed to load.</div>;
  }
  const { data, isPending } = useQuery({
    queryKey: ["customers"],
    queryFn: () => get("customers", (loaderData as any)?.id),
  });

  return isPending ? <Loading /> : <CustomerForm initialData={data} mode="edit" />;
};

export default Page;