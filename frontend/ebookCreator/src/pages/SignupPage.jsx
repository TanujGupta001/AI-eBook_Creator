import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, BookOpen} from "lucide-react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from  "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
const SignupPage = () => {
const [formData, setFormData] = useState({name: "", email:"",  password: ""});
const [isLoading, setIsLoading] = useState(false);
const {login} = useAuth();
const navigate = useNavigate();
const handleChange = (e) => {
setFormData({...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
e.preventDefault();
setIsLoading(true);
try {
  const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,formData);
  const {token} = response.data;

  const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE,{
    headers: {Authorization : `Bearer ${token}`},
  });
  login(profileResponse.data,token);
  toast.success("Account created successfuly!");
  navigate("/dashboard");
} catch (error) {
toast.error(error.response?.data?.message || "Signup failed. Please try again.");
console.log(error)
} finally {
setIsLoading (false);
}
};
  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-violet-400 to-violet-500 rounded-full mb-4 shadow-md">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create an Account </h1>
          <p className="text-slate-600 mt-2">
            Start your journey of creating amazing eBooks Today
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default SignupPage
