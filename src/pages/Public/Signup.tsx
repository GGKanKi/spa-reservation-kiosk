import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthServices } from '../../services/AuthServices';
import { SignUpSchema, type SignUpFormData } from '../../services/ValidationServices';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const finaluserData = {
      ...data,
      created_at: new Date().toISOString(),
      userRole: 'member',
    };

    const { data: signupData, error } = await AuthServices.signup(
      finaluserData.firstName,
      finaluserData.middleName,
      finaluserData.lastName,
      finaluserData.phoneNum,
      finaluserData.emailAddress, 
      finaluserData.password
    );

    if (error) {
      console.error("Signup Error:", error);
      setErrorMsg(error);
      setIsSubmitting(false);
    } else {
      console.log("Signup successful:", signupData);
      setIsSubmitting(false);
      navigate("/member/dashboard");
    }
  };

  return (
    <div className="flex h-screen bg-gray-300">
      {/* Left Side - Branding */}
      <div className="w-1/2 bg-gradient-to-b from-purple-300 to-purple-200 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-lg tracking-tight" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.2)' }}>
            SPA RESERVATION
          </h1>
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mt-4 tracking-tight" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.2)' }}>
            KIOSK
          </h2>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-semibold">SIGN UP</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {errorMsg}
              </div>
            )}

            {/* First Name */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">First Name</label>
              <input
                {...register('firstName')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Middle Name</label>
              <input
                {...register('middleName')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.middleName && <p className="text-red-500 text-xs mt-1">{errors.middleName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Last Name</label>
              <input
                {...register('lastName')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Phone Number</label>
              <input
                {...register('phoneNum')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.phoneNum && <p className="text-red-500 text-xs mt-1">{errors.phoneNum.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Email</label>
              <input
                {...register('emailAddress')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.emailAddress && <p className="text-red-500 text-xs mt-1">{errors.emailAddress.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Value"
                className="w-full px-3 py-2 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 rounded mt-6 transition flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  SIGN UP
                </>
              ) : (
                'SIGN UP'
              )}
            </button>

            <button              
            type="button"
            onClick={() => navigate("/login")}>
              <p className="text-center text-sm text-gray-500 mt-4 hover:text-gray-700 transition">
                Already have an account? <span className="font-semibold">Sign In</span>
              </p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
