import axios from "axios";
import { API_URL } from "constant/constant";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router";

interface AuthErrorState {
    loginError: string | null;
    registerError: string | null;
}

type AccessToken = {
    abilities?: string[];
    expiresAt?: null | string;
    lastUsedAt?: null | string;
    name?: null | string;
    token: string;
    type?: string | null;
}

interface AuthContextType {
    user: string | null;
    login: (email: string, password: string, rememberMe: boolean) => void;
    logout: () => void;
    register: (email: string, password: string, fullName: string, rememberMe: boolean) => void;
    error: AuthErrorState;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// const API_URL = process.env.VITE_API_URL;
// const IMPORT_URL = import.meta.env.VITE_API_URL
console.log("API_URL:", API_URL);
console.log("API_URL:", API_URL);
console.log("API_URL:", API_URL);
console.log("API_URL:", API_URL);
// console.log("API_URL:", IMPORT_URL);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [error, setError] = useState<AuthErrorState>({ loginError: null, registerError: null });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     const token =
    //         localStorage.getItem("authToken") ||
    //         sessionStorage.getItem("authToken");
    //     if (token) {
    //         setUser(token);
    //     }
    // }, []);
    useEffect(() => {
        const token =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");

        if (token) {
            setUser(token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        setLoading(false);
    }, []);


    useEffect(() => {
        setError({ loginError: null, registerError: null });
    }, [location.pathname]);

    const login = async (email: string, password: string, rememberMe: boolean) : Promise<void> => {
        try {
            const response = await axios.post<{ token: AccessToken }>(`${API_URL}/login`, {
            // const response = await axios.post<{ token: AccessToken }>("http://localhost:3333/login", {
                email,
                password,
            });
            const token = response.data.token.token;
            if (rememberMe) {
                localStorage.setItem("authToken", token);
            } else {
                sessionStorage.setItem("authToken", token);
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(token);
            navigate("/");
            
        } catch (error : any) {
            console.error("Login failed:", error.response?.data || error.message);
            setError((prev) => ({ ...prev, loginError: error.response?.data?.message || "Login failed. Please try again." }));
        }
    
    };

    const logout = () => {
        // localStorage.removeItem("authToken");
        // sessionStorage.removeItem("authToken");
        // setUser(null);
        // navigate("/login");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        navigate("/login");
    };

    const register = async (email: string, password: string, fullName: string, rememberMe: boolean) => {
        try {
            const response = await axios.post<{ token: AccessToken }>(`${API_URL}/register`, {
            // const response = await axios.post<{ token: AccessToken }>("http://localhost:3333/register", {
                email,
                password,
                fullName,
            });
            const token = response.data.token.token;
            if (rememberMe) {
                localStorage.setItem("authToken", token);
            } else {
                sessionStorage.setItem("authToken", token);
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(token);
            setError({ loginError: null, registerError: null });
            navigate("/");
        } catch (error: any) {
            console.error("Signup failed:", error.response?.data || error.message);
            setError((prev) => ({ ...prev, registerError: error.response?.data?.message || "Registration failed" }));
        }
    }

    const clearError = () => {
        setError({ loginError: null, registerError: null });
    };

    return (
        // <AuthContext.Provider value={{ user, login, logout, error }}>
        <AuthContext.Provider value={{ user, login, logout, register, error, clearError }}>
            {/* {children} */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
