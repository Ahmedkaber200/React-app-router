import { get } from "@/client/api-client";
import { AppSidebar } from "@/components/app-sidebar";
type Route = {
  id: string;
  name: string;
};

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, redirect } from "react-router";
import type { Route } from "../+types/home";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

// export async function loader({ request }: Route.LoaderArgs) {
//   try {
//     const data = await get("/getprofile", {
//       req: request,
//     });

//     if (!data) throw redirect("/auth/login");

//     return data;
//   } catch {
//     throw redirect("/auth/login");
//   }
// }

export default function AdminLayout() {
  // const { setUser } = useAuthStore();

  // jab loader data mile to zustand update

  // useEffect(() => {
  //   if (loaderData) {
     
  //     setUser(loaderData);
  //   }
  // }, [loaderData, setUser]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
