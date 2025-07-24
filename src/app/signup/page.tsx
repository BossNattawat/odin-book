"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

interface FormData {
  displayName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.displayName.trim() === "") {
      toast.error("Please provide display name!");
    }

    if (data.username.trim() === "") {
      toast.error("Please provide username!");
    }

    if (data.password.trim() === "") {
      toast.error("Please provide password!");
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Password does not match!");
    }

    if (data.username.trim().length > 0 && data.password.trim().length > 0) {
      const formData = {
        displayName: data.displayName,
        username: data.username,
        password: data.password,
      };

      try {
        await axios.post("/api/auth/signup", formData);
        toast.success("Account created successfully");

        router.push("/login");
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full py-24 px-4 flex justify-center items-center">
      <div className="flex max-w-md w-[52rem]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col bg-base-300 p-8 w-full rounded-md shadow-xs"
        >
          <h1 className="text-3xl font-semibold text-center">Signup</h1>
          <div className="flex flex-col mt-5">
            <label htmlFor="name" className="label">
              Display Name:
            </label>
            <input
              type="text"
              id="displayname"
              placeholder="Enter your display name..."
              className="input w-full"
              {...register("displayName", {
                required: "Display Name is required",
              })}
            />
            {errors.displayName && (
              <div role="alert" className="alert alert-warning mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{errors.displayName.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="name" className="label">
              Username:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name..."
              className="input w-full"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <div role="alert" className="alert alert-warning mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{errors.username.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="email" className="label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password..."
              className="input w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <div role="alert" className="alert alert-warning mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="email" className="label">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Enter your confirm password..."
              className="input w-full"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.confirmPassword && (
              <div role="alert" className="alert alert-warning mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success text-white my-5"
          >
            {isSubmitting ? "Loading..." : "Signup"}
          </button>
          <p className='self-center'>Already have an account? <Link className='text-accent underline' href={"/login"}>Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
