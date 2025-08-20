import React from "react";
import { CustomerForm } from "./_components/customer.form";
import type { Route } from "./+types";
import { get } from "@/client/api-client";

// -------------------------------
// Type for Customer (adjust according to your API)
type Customer = {
  id: string;
  name: string;
  email: string;
  // add other fields...
};

// -------------------------------
// Loader (SSR fetching)
export async function loader({ params }: Route.LoaderArgs) {
  const id = (params as any).id as string; // ✅ safer than (params as any)
  const data: Customer | null = await get(`/customers/${id}`);
  return { data };
}

// -------------------------------
// Page Component
const Page = ({ loaderData }: Route.ComponentProps) => {
  if (!(loaderData as any)?.data) {
    return (
      <div className="text-red-500">Customer not found or failed to load.</div>
    );
  }

  return <CustomerForm initialData={(loaderData as any).data} mode="edit" />;
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
