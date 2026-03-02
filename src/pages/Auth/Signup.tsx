import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthServices } from '../../services/AuthServices';

// 1. Define the validation schema
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().min(2, 'Middle name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNum: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const { data: authData, error } = await AuthServices.signup(
      data.firstName,
      data.middleName,
      data.lastName,
      data.phoneNum,
      data.email,
      data.password
    );

    if (error) {
      setErrorMsg(error);
      setIsSubmitting(false);
    } else {
      navigate('/');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register('firstName')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Middle Name</label>
          <input
            {...register('middleName')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.middleName && <p className="text-red-500 text-xs mt-1">{errors.middleName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register('phoneNum')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.phoneNum && <p className="text-red-500 text-xs mt-1">{errors.phoneNum.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex justify-center items-center"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}