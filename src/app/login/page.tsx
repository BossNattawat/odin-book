"use client"

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import toast from 'react-hot-toast'

interface FormData {
    username: string
    password: string
}

function Login() {

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormData>()
    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        
        if(data.username.trim() === "") {
            toast.error("Please provide username!")
        }

        if(data.password.trim() === "") {
            toast.error("Please provide password!")
        }

        if (data.username.trim().length > 0 && data.password.trim().length > 0) {
            try {

                const username = data.username
                const password = data.password
                
                const result = await signIn('credentials', {
                    redirect: false,
                    username,
                    password,
                });

                if (result?.error) {
                    toast.error(result.error)
                } else {
                    router.push('/');
                }
            } catch {
                toast.error("An unexpected error occurred. Please try again.")
            }
        }
    }

  return (
    <div className='min-h-screen w-full py-24 px-4 flex justify-center items-center'>
        <div className="flex max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-base-300 p-8 w-full rounded-md shadow-xs">
                <h1 className='text-3xl font-semibold text-center'>Login</h1>
                <div className="flex flex-col mt-5">
                    <label htmlFor="name" className="label">Name:</label>
                    <input type="text" id="name" placeholder="Enter your name..." className="input w-full" {...register("username", {required: "Username is required"})} />
                    {errors.username && (
                        <div role="alert" className="alert alert-warning mt-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errors.username.message}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col mt-5">
                    <label htmlFor="email" className="label">Password:</label>
                    <input type="password" id="password" placeholder="Enter your password..." className="input w-full" {...register("password", {required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters long" }})} />
                    {errors.password && (
                        <div role="alert" className="alert alert-warning mt-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errors.password.message}</span>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-success text-white my-5">{isSubmitting ? "Loading..." : "Login"}</button>
            </form>
        </div>
    </div>
  )
}

export default Login