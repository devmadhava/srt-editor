import { useForm, type SubmitHandler } from "react-hook-form";
import ErrorAlert from "./ErrorAlert";
import { useAuth } from "context/AuthProvider";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginFormInputs>();
    const { login } = useAuth();
    
    // const onSubmit: SubmitHandler<LoginFormInputs> = (data) => console.log(data);
    const onSubmit : SubmitHandler<LoginFormInputs> = async (data) => {
        await login(data.email, data.password, data.rememberMe);
    }
    
    return (
        <form className="flex flex-col gap-5 w-[400px]">
            <label className="floating-label">
                <span className="bg-base-200">Your Email</span>
                <input
                    type="text" 
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
            {errors.email && (
              <ErrorAlert message={errors.email.message} />
            )}
            <label className="floating-label">
                <span className="bg-base-200">Your Password</span>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters long",
                        },
                        maxLength: {
                            value: 20,
                            message: "Password cannot exceed 20 characters",
                        },
                    })}
                />
            </label>
            {errors.password && (
              <ErrorAlert message={errors.password.message} />
            )}
            {/* <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm text-primary-content">
                    <input type="checkbox" className="checkbox checkbox-xs" {...register("rememberMe")}/>
                    <span>Remember Me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
            </div> */}
            <button onClick={handleSubmit(onSubmit)} className="btn btn-primary w-[120px] mt-10">Submit</button>
        </form>
    )
}