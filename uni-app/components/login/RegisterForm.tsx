import { useForm, type SubmitHandler } from "react-hook-form";
import ErrorAlert from "./ErrorAlert";
import { useAuth } from "context/AuthProvider";

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormInputs>();
    const { register : signup } = useAuth();
    

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        await signup(data.email, data.password, data.fullName, data.rememberMe);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-[400px]">
            {/* Name Field */}
            <label className="floating-label">
                <span className="bg-base-200">Your Name</span>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="input"
                    {...register("fullName", {
                        required: "Name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters long" },
                    })}
                />
            </label>
            {errors.fullName && <ErrorAlert message={errors.fullName.message} />}

            {/* Email Field */}
            <label className="floating-label">
                <span className="bg-base-200">Your Email</span>
                <input
                    type="email"
                    placeholder="Type here"
                    className="input"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Enter a valid email address",
                        },
                    })}
                />
            </label>
            {errors.email && <ErrorAlert message={errors.email.message} />}

            {/* Password Field */}
            <label className="floating-label">
                <span className="bg-base-200">Your Password</span>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters long" },
                        maxLength: { value: 20, message: "Password cannot exceed 20 characters" },
                    })}
                />
            </label>
            {errors.password && <ErrorAlert message={errors.password.message} />}

            {/* Confirm Password Field */}
            <label className="floating-label">
                <span className="bg-base-200">Confirm Password</span>
                <input
                    type="password"
                    placeholder="Re-enter password"
                    className="input input-bordered"
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                            value === watch("password") || "Passwords do not match",
                    })}
                />
            </label>

            {/* <label className="flex items-center gap-2 text-sm text-primary-content">
                <input type="checkbox" className="checkbox checkbox-xs" {...register("rememberMe")}/>
                <span>Remember Me</span>
            </label> */}
            {errors.confirmPassword && <ErrorAlert message={errors.confirmPassword.message} />}

            <button onClick={handleSubmit(onSubmit)} className="btn btn-primary w-[120px] mt-2">Sign Up</button>
        </form>
    );
}
