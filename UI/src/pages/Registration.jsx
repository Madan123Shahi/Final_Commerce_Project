import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState("");

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  useEffect(() => {
    if (errors.api) {
      const timer = setTimeout(() => setErrors({}), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.api]);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await api.post("/register", form);
      setSuccess(true);
      setForm({ email: "", phone: "", password: "" });
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Network error. Please try again.";
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "email", label: "Email address", required: true, type: "email" },
    { name: "phone", label: "Phone", required: true, type: "tel" },
    { name: "password", label: "Password", required: true, type: "password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#00c6a7] via-[#0080ff] to-[#4fc3f7]">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-30 bg-[radial-gradient(circle,#00e5ff,transparent)] -translate-x-[30%] -translate-y-[30%]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 bg-[radial-gradient(circle,#0057ff,transparent)] translate-x-[30%] translate-y-[30%]" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 px-10 py-10">
        <h1 className="text-center text-2xl font-bold mb-8 tracking-wide text-[#0057c8]">
          <span className="text-cyan-400 mr-2">·</span>
          Create Account
          <span className="text-cyan-400 ml-2">·</span>
        </h1>

        {success && (
          <div className="mb-5 p-3 rounded-md bg-green-50 border border-green-200 text-green-600 text-sm text-center">
            Account created successfully!
          </div>
        )}

        {errors.api && (
          <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-500 text-sm text-center">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isFocused = focused === field.name;
            const hasValue = form[field.name] !== "";
            const hasError = !!errors[field.name];

            return (
              <div key={field.name} className="mb-5 relative">
                {field.required && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">
                    ·
                  </span>
                )}
                {/* Floating Label Input */}
                <div
                  className={`relative rounded-lg border-2 transition-all duration-200 bg-gray-50 ${
                    hasError
                      ? "border-red-400 bg-red-50"
                      : isFocused
                        ? "border-cyan-400 bg-white shadow-sm shadow-cyan-100"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Floating Label */}
                  <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                      isFocused || hasValue
                        ? "top-1 text-[10px] font-semibold"
                        : "top-1/2 -translate-y-1/2 text-sm"
                    } ${
                      hasError
                        ? "text-red-400"
                        : isFocused
                          ? "text-cyan-500"
                          : "text-gray-400"
                    }`}
                  >
                    {field.label}
                  </label>

                  <div className="flex items-center">
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
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused("")}
                      className="flex-1 outline-none pt-5 pb-2 px-3 text-gray-700 text-sm bg-transparent rounded-lg"
                    />

                    {field.name === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pr-3 text-gray-400 hover:text-cyan-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Field Error */}
                {hasError && (
                  <p className="text-red-400 text-xs mt-1 ml-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-bold tracking-widest text-sm transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-200 active:scale-95 bg-gradient-to-r from-[#00b4d8] to-[#0077e6] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                REGISTERING...
              </>
            ) : (
              "REGISTER"
            )}
          </button>
        </form>

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
