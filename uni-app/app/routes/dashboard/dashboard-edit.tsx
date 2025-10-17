// import Table from "components/dashboard/Table";

// export default function DashboardHome() {
//     return (
//         <div className="w-full h-full bg-blue-900 overflow-y-scroll pt-60">
//             <Table headers={["Sr No.", "Filename", "Last Modified", "Options"]} />
//         </div>
//     );
// }

import { useForm, type SubmitHandler } from "react-hook-form";

interface ProfileFormInputs {
    username: string;
    email: string;
    password: string;
}

export default function EditProfile() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormInputs>();

    const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
        console.log("Profile Updated:", data);
    };

    return (
        <div className="p-6 w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form className="flex flex-col gap-5 w-[400px]" onSubmit={handleSubmit(onSubmit)}>
                <label className="form-control">
                    <span className="label-text">Username</span>
                    <input
                        type="text"
                        {...register("username", { required: "Username is required" })}
                        className="input input-bordered w-full"
                        placeholder="Enter your username"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </label>

                <label className="form-control">
                    <span className="label-text">Email</span>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        })}
                        className="input input-bordered w-full"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </label>

                <label className="form-control">
                    <span className="label-text">New Password</span>
                    <input
                        type="password"
                        {...register("password", {
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long",
                            },
                            maxLength: {
                                value: 20,
                                message: "Password cannot exceed 20 characters",
                            },
                        })}
                        className="input input-bordered w-full"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </label>
                
                <button type="submit" className="btn btn-primary w-full">Update Profile</button>
            </form>
        </div>
    );
}
