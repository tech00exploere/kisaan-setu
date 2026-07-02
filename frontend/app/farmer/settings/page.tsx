"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, Shield, Smartphone, Globe, Lock, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [locationPerm, setLocationPerm] = useState(true);
  const [cameraPerm, setCameraPerm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("appTheme") || "light";
      const storedNotifs = localStorage.getItem("appNotifs") !== "false";
      const storedLoc = localStorage.getItem("appLoc") !== "false";
      const storedCam = localStorage.getItem("appCam") === "true";

      setTheme(storedTheme);
      setNotifications(storedNotifs);
      setLocationPerm(storedLoc);
      setCameraPerm(storedCam);
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appTheme", theme);
      localStorage.setItem("appNotifs", notifications.toString());
      localStorage.setItem("appLoc", locationPerm.toString());
      localStorage.setItem("appCam", cameraPerm.toString());

      // Apply the theme immediately without requiring a refresh
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    // Quick visual feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-10 px-4 pt-4">
      {/* Header */}
      <div className="h-20 flex justify-between items-center w-full border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
            <p className="text-sm text-slate-500">Manage your preferences, appearance, and permissions.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSaved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Appearance</h2>
              <p className="text-xs text-slate-500">Customize how KisaanSetu looks on your device.</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">Theme Mode</p>
              <p className="text-xs text-slate-500">Choose between light and dark mode</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === "light" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === "dark" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Notifications</h2>
              <p className="text-xs text-slate-500">Control what alerts you receive from the platform.</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">Push Notifications</p>
              <p className="text-xs text-slate-500">Receive alerts for new orders and messages</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Privacy & Permissions</h2>
              <p className="text-xs text-slate-500">Manage what access the application has to your device.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Location Services</p>
                  <p className="text-xs text-slate-500">Allow access to location to find nearby buyers/sellers</p>
                </div>
              </div>
              <button 
                onClick={() => setLocationPerm(!locationPerm)}
                className={`w-12 h-6 rounded-full transition-colors relative ${locationPerm ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${locationPerm ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Camera Access</p>
                  <p className="text-xs text-slate-500">Allow camera to scan QR codes and upload crop photos</p>
                </div>
              </div>
              <button 
                onClick={() => setCameraPerm(!cameraPerm)}
                className={`w-12 h-6 rounded-full transition-colors relative ${cameraPerm ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${cameraPerm ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-800">Security</h2>
              <p className="text-xs text-slate-500">Update your password or enable two-factor authentication.</p>
            </div>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
              Manage Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
