import { get } from "@/client/api-client";
import { AppSidebar } from "@/components/app-sidebar";
type Route = {
  id: string;
  name: string;
};

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigate, Outlet, redirect } from "react-router";
import type { Route } from "../+types/home";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/client/supabase-client";
import type { Session } from "@supabase/supabase-js";
import Loading from "@/components/loding";
import { toast } from "sonner";
// import { supabase } from "@/client/supabase-client";

// export async function loader() {
//   try {
//     const { data  } = await supabase.auth.getSession();
//     console.log(data);
//     if (!data.session) throw redirect("/auth/login");
//     return data.session;
//   } catch {
//     throw redirect("/auth/login");
//   }
// }

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log(error);
      if (error) {
        toast.error(error.message);
      }
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <Loading />;
  if (!session) return <Navigate to="/auth/login" />;
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
