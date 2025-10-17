import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("routes/app.tsx", [
        index("routes/editor.tsx"),
        route("login", "routes/login.tsx"),
        // route("editor", "routes/editor.tsx"),
        ...prefix("dashboard", [
            layout("routes/dashboard/dashboard.tsx", [
                route("/", "routes/dashboard/dashboard-home.tsx"),
                route("/edit", "routes/dashboard/dashboard-edit.tsx"),
                route("/saved", "routes/dashboard/dashboard-saved.tsx"),
            ])
        ])
    ])
] satisfies RouteConfig;