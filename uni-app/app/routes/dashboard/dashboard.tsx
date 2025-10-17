import { LibraryBig, LogOut, Plus, Star, User2 } from "lucide-react";
import { Outlet, useLocation } from "react-router";
// import type { Route } from "../+types/home";


import PrivateRoute from "components/PrivateRoute";
import type { Route } from "../+types/editor";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "User Dashboard" },
        {
            name: "description",
            content: "Dashboard for SRT Editor Users!",
        },
    ];
}

export default function DashboardLayout() {
    const location = useLocation();

    const links = [
        { name: "Create SRT", path: "/", icon: <Plus size={18} /> },
        { name: "My Subtitles", path: "/dashboard", icon: <LibraryBig size={18} /> },
        { name: "Logout", path: "/logout", icon: <LogOut size={18} /> },
    ];

    return (
        <PrivateRoute>
        <div className="flex">
            <aside className="h-screen w-[250px] py-[5%] text-primary-content flex flex-col justify-between bg-base-100">
                <div className="w-full flex flex-col">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className={`py-4 pl-6 cursor-pointer hover:bg-primary duration-300 text-sm ${location.pathname === link.path ? "font-bold" : ""}`}
                        >
                            <span className="flex items-center gap-2">{link.icon} {link.name}</span>
                        </a>
                    ))}
                </div>

                <a className="py-4 pl-6 cursor-pointer hover:text-primary duration-300 text-base font-bold">
                    <span className="flex items-center gap-2">SRT EDITOR</span>
                </a>
            </aside>

            <div className="w-full h-screen flex justify-stretch items-stretch">
                <Outlet />
            </div>
        </div>
        </PrivateRoute>
    );
}
