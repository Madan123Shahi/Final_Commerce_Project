import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fields = [
    { name: "email", label: "Email address", required: true, type: "email" },
    { name: "phone", label: "Phone", required: true, type: "tel" },
    { name: "password", label: "Password", required: true, type: "password" },
  ];

  return (
    <div className="min-h-screen flex flex-center relative overflow-hidden bg-gradient-to-br from-[#00c6a7] via-[#0080ff] to-[#4fc3f7]">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-30 bg-[radial-gradient(circle,#00e5ff,transparent)] -translate-x-[30%] -translate-y-[30%]" />

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 bg-[radial-gradient(circle, #0057ff, transparent)] traslate-x-[30%] translate-y-[30%]" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 px-10 py-10">
        {/* Title */}
        <h1 className="text-center text-2xl font-bold mb-8 tracking-wide text-[#0057c8]">
          <span className="text-cyan-400 mr-2">·</span>
          Create Account
          <span className="text-cyan-400 ml-2">·</span>
        </h1>

        {/* Fields */}
        {fields.map((field) => (
          <div key={field.name} className="mb-5 relative">
            {field.required && (
              <span className="absolute -left-4 top-1 text-cyan-500 font-bold text-sm">
                ·
              </span>
            )}

            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-cyan-400 transition-colors">
              <input
                name={field.name}
                type={
                  field.name === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="flex-1 outline-none py-1 text-gray-600 placeholder-gray-400 text-sm bg-transparent"
              />

              {/* Password Toggle */}
              {field.name === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-800 hover:text-blue-600 transition-colors ml-2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          className="w-full py-3 rounded-md text-white font-bold tracking-widest text-sm transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(90deg, #00b4d8, #0077e6)" }}
        >
          REGISTER
        </button>

        {/* Sign in */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a
            href="#"
            className="text-cyan-500 hover:text-cyan-700 font-medium transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
