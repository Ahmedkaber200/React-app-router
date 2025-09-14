import React from "react";
import { ProductForm } from "./_components/product.form";
import type { Route } from "./+types";
import { get } from "@/client/supabase-client";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loding";

// -------------------------------
// Type for Product (adjust according to your API)
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
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
    return (
      <div className="text-red-500">
        Product not found or failed to load.
      </div>
    );
  }

  const { data, isPending } = useQuery<Product>({
    queryKey: ["products", (loaderData as any)?.id],
    queryFn: () => get("products", (loaderData as any)?.id),
  });

  const initialData =
    data && {
      id: data.id ? Number(data.id) : undefined,
      name: data.name,
      description: data.description,
      price: data.price.toString(),
    };

  return isPending ? <Loading /> : <ProductForm initialData={initialData} mode="edit" />;
};

export default Page;
