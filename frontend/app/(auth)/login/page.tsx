"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tractor, Building2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch user info using the access token
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const { name, email } = userInfo.data;
        
        // Mock backend session creation
        const token = "mock-google-jwt-" + Date.now();
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "farmer"); // Default role
        
        setSuccessMessage(`Welcome back, ${name}!`);
        
        // Ensure token is persisted before navigating
        await new Promise(r => setTimeout(r, 1500));
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Google Login error", err);
        setError("Failed to authenticate with Google.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed", error);
      setError("Google login was canceled or failed.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting login", formData);
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      // Log full response and its nested data for debugging
      console.log('Login response full object:', response);
      console.log('Response.data:', response.data);
      console.log('Response.data.data (if present):', response.data?.data);

      // Robust extraction handling both possible shapes
      const token = response.data?.token ?? response.data?.data?.token;
      const role = response.data?.user?.role ?? response.data?.data?.user?.role ?? 'farmer';
      localStorage.setItem('token', token);
      console.log('🟢 Token saved to localStorage:', token);
      localStorage.setItem('userRole', role);
      // Ensure token is persisted before navigating
      await new Promise(r => setTimeout(r, 2000));
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login error", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background Blurs */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">S</div>
              <span className="text-xl">Super Mandi</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-3 text-slate-600">Sign in to continue managing products, orders and procurement activities.</p>
          </div>

          {/* Login Card */}
          <Card className="rounded-3xl border-0 bg-white shadow-sm">
            <CardContent className="p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-2xl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-2xl"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="font-medium text-orange-600 hover:text-orange-700">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Signing in…" : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm text-slate-500">OR</span>
                  </div>
                </div>

                {/* Google Login */}
                <Button 
                  type="button" 
                  onClick={() => handleGoogleLogin()} 
                  disabled={loading}
                  variant="outline" 
                  className="h-12 w-full rounded-2xl border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </Button>

                {/* Register */}
                <p className="text-center text-sm text-slate-600">
                  Don't have an account? <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700">Create Account</Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Trust Section */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                <Tractor className="h-5 w-5 text-orange-500" />
                <p className="text-sm font-semibold text-slate-900">Verified Farmers</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-slate-900">Secure Deals</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                <Building2 className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-slate-900">Trusted Companies</p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-slate-500">
            © 2026 Super Mandi. India's Agricultural Operating System.
          </div>
        </div>
      </div>
    </main>
  );
}