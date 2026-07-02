"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tractor, Building2 } from "lucide-react";

import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  role: "farmer",
  password: "",
  confirmPassword: "",
  location: "Bihar",
  landArea: "12",
  primaryCrops: "Wheat, Rice, Maize",
  farmingType: "Organic",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting registration', formData);

  if (
    formData.password !==
    formData.confirmPassword
  ) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Simulate backend response & save registration details to localStorage for mock persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("farmerName", formData.name);
      localStorage.setItem("farmerLocation", formData.location);
      localStorage.setItem("farmerLandArea", formData.landArea);
      localStorage.setItem("farmerPrimaryCrops", formData.primaryCrops);
      localStorage.setItem("farmerFarmingType", formData.farmingType);
      localStorage.setItem("userRole", formData.role);
    }

    const response =
      await axiosInstance.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
        }
      );

    console.log('Response', response.data);
    setSuccessMessage("Registration successful! Redirecting...");

    router.push("/login");
  } catch (err) {
    console.error('Registration error', err);
    setError(
      err.response?.data?.message ||
      "Registration failed"
    );
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold tracking-tight"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white font-bold text-lg">
                K
              </div>
              <span className="text-xl">KISAAN SETU</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Create Your Account
            </h1>
            <p className="mt-3 text-slate-600">
              Join KISAAN SETU and start buying, selling, and managing agricultural procurement efficiently.
            </p>
          </div>

          {/* Register Card */}
          <Card className="rounded-3xl border-0 bg-white shadow-sm">
            <CardContent className="p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    className="h-12 rounded-2xl"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-2xl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="h-12 rounded-2xl"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                {/* User Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    I am a
                  </label>
                  <select
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 bg-white"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* Farmer Details Fields (Displayed only if Role is Farmer) */}
                {formData.role === "farmer" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Location / State
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Bihar"
                        className="h-12 rounded-2xl"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Land Area (in Acres)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 12"
                        className="h-12 rounded-2xl"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Primary Crops
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Wheat, Rice, Maize"
                        className="h-12 rounded-2xl"
                        value={formData.primaryCrops}
                        onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Farming Type
                      </label>
                      <select
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 bg-white"
                        value={formData.farmingType}
                        onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                      >
                        <option value="Organic">Organic</option>
                        <option value="Conventional">Conventional</option>
                        <option value="Hydroponic">Hydroponic</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-2xl"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    className="h-12 rounded-2xl"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="mt-1 h-4 w-4" required />
                  <span>
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>

                {/* Register Button */}
                <button type="submit" className="h-12 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2 cursor-pointer">
                      Create Account
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
                    <span className="bg-white px-3 text-sm text-slate-500">
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Signup */}
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200"
                >
                  Sign up with Google
                </Button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Sign In
                  </Link>
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