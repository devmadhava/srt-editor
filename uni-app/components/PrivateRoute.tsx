import type { JSX } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
