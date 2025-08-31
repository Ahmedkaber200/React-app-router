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
// Loader (SSR fetching)
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

// import React from "react";
// import { CustomerForm } from "./_components/customer.form";
// import type { Route } from "./+types";
// import { useQuery } from "@tanstack/react-query";
// import { get } from "@/client/api-client";

// export async function loader({ params }: Route.LoaderArgs) {
//   let data = await  get(`/customers/${(params as any).id}`);
//   return { data };
// }

// const page = ({ params,loaderData }: Route.ComponentProps) => {

// //   const id = (params as any)?.id;
// // const { data, isLoading, isError } = useQuery<any>({
// //     queryKey: ["customer", id],
// //     queryFn: () => get(`/customers/${id}`),
// //     enabled: !!id,
// //   });

// //   if (isLoading) return <div>Loading customer...</div>;
// //   if (isError) return <div>Failed to load customer.</div>;

//   return <CustomerForm initialData={(loaderData as any).data} mode="edit" />;
// };

// export default page;
