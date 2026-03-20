import { Shield, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Registration = () => {
  const steps = [
    { id: 0, label: "Details" },
    { id: 1, label: "Phone" },
    { id: 2, label: "Email" },
  ];

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col items-center p-10 rounded-2xl">
        {/* Icon */}
        <div className="bg-green-500 p-2 rounded-xl">
          <Shield className="text-white w-8 h-8" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl mt-4">Create Account</h1>
        <p className="text-gray-400 text-sm">
          Verified, secure sign-up in 3 steps
        </p>

        {/* Steps */}
        <div className="flex mt-4">
          {steps.map((step, index) => (
            <div className="flex items-center" key={step.id}>
              <div className="flex flex-col items-center">
                <div className="rounded-full border-2 border-green-500 w-8 h-8 flex items-center justify-center text-green-500 text-sm font-medium">
                  {step.id + 1}
                </div>
                <p className="text-xs mt-1 text-gray-500">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="h-[2px] w-16 bg-gray-300 mx-2 mb-4" />
              )}
            </div>
          ))}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col w-full mt-4 gap-2">
          <label className="text-sm font-medium">Phone Number</label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              className="border-2 border-gray-200 rounded-md w-full py-1 pl-9 placeholder:text-gray-400 text-sm text-gray-400 outline-none focus:border-green-400"
              placeholder="10-digit mobile number"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col w-full mt-3 gap-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              className="border-2 border-gray-200 rounded-md w-full py-1 pl-9 placeholder:text-gray-400 text-sm text-gray-400 outline-none focus:border-green-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col w-full mt-3 gap-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="border-2 border-gray-200 rounded-md w-full py-1 pl-9 pr-9 placeholder:text-gray-400 text-sm text-gray-400 outline-none focus:border-green-400"
              placeholder="minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full mt-6 bg-green-500 text-white py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors">
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-sm text-gray-400 mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 cursor-pointer hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
