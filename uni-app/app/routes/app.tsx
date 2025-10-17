import { AuthProvider } from "context/AuthProvider";
import { Outlet } from "react-router";

export default function App() {
    return (
        <AuthProvider>
            <Outlet /> {/* Now everything inside this tree has AuthProvider */}
        </AuthProvider>
    );
}