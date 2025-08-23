import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/auth/auth.tsx",
    [
      route("auth/login","routes/auth/login.tsx"),
      route("auth/register", "routes/auth/register.tsx"),
    ]
  ),
  layout("routes/portal/layout.tsx",
    [
      route("dashboard", "routes/portal/dashboard/page.tsx"),
      route("customers", "routes/portal/customer/index.tsx"),
      route("customers/create", "routes/portal/customer/create.tsx"),
      route("customers/:id", "routes/portal/customer/edit.tsx"),

      route("products", "routes/portal/product/index.tsx"),
    ]
  ),
] satisfies RouteConfig;