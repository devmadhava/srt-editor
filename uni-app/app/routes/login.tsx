import LoginForm from "components/login/LoginForm";
import type { Route } from "../+types/root";
import RegisterForm from "components/login/RegisterForm";
import { useEffect, useState } from "react";
import loginImage from "../../asset/login.jpg";
import Navbar from "components/Navbar";
import ErrorAlert from "components/login/ErrorAlert";
import { useAuth } from "context/AuthProvider";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Login or Signup to the SRT Editor" },
        {
            name: "description",
            content: "Login to your SRT Editor Account!",
        },
    ];
}

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSignup, setIsSignup] = useState(false);
    const { error } = useAuth();

    useEffect(() => {
        const signupParam = searchParams.get("signup");
        setIsSignup(signupParam === "true");
    }, [searchParams]);

    return (
        <div className="w-full min-h-screen pt-[65px]">
            <Navbar />

            <div className="w-full h-full flex justify-end items-stretch bg-base-100">
                <div className="w-full md:w-1/2 h-full shrink-0 overflow-hidden ">
                    <div
                        className={`w-full h-full flex shrink-0 transition-transform duration-500 ${
                            isSignup ? "-translate-x-[100%]" : "translate-x-0"
                        }`}
                    >
                        {/* Login */}
                        <div className="w-full h-full shrink-0 flex flex-col px-16 py-20 justify-between font-sans text-primary-content">
                            <p className="font-mono">SRT Editor 🖆</p>
                            <div>
                                <h1 className="text-3xl font-bold mb-4">
                                    Hallo, <br />
                                    Welcome to SRT Editor!{" "}
                                </h1>
                                <p
                                    className={`text-base ${
                                        error.loginError ? "mb-4" : "mb-10"
                                    }`}
                                >
                                    Hey, Welcome to the SRT Editor! Login to
                                    your Account!
                                </p>
                                {error.loginError && (
                                    <ErrorAlert
                                        className="mb-8"
                                        message={error.loginError}
                                    />
                                )}
                                <LoginForm />
                            </div>
                            <p className="mt-10">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setIsSignup(true)}
                                    className="font-bold text-primary cursor-pointer hover:underline"
                                >
                                    Signup
                                </button>
                            </p>
                        </div>

                        {/* Register */}
                        <div className="w-full h-full shrink-0 flex flex-col px-16 py-20 justify-between font-sans text-primary-content">
                            <p className="font-mono">SRT Editor 🖆</p>
                            <div>
                                <h1 className="text-3xl font-bold mb-4">
                                    First time? <br /> Register an account here!
                                </h1>
                                <p
                                    className={`text-base ${
                                        error.registerError ? "mb-4" : "mb-10"
                                    }`}
                                >
                                    Create Your account to save and share your
                                    SRT Files!
                                </p>
                                {error.registerError && (
                                    <ErrorAlert
                                        className="mb-8"
                                        message={error.registerError}
                                    />
                                )}
                                <RegisterForm />
                            </div>
                            <p className="mt-10">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsSignup(false)}
                                    className="font-bold text-primary cursor-pointer hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex w-1/2 shrink-0">
                    <img
                        src={loginImage}
                        alt="Authentication Image"
                        className="h-full object-cover object-center"
                    />
                </div>
            </div>
        </div>
    );
}
