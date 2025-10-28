"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Code2, 
  Save,
  Mail,
  Globe2,
  Eye,
  EyeOff
} from "lucide-react";
import React, { useState } from "react";

function SettingsPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [showEmail, setShowEmail] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState("javascript");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-sm opacity-70">Manage your account settings and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="text-sm mb-2 block">Username</Label>
                <Input 
                  id="username"
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm mb-2 block">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm mb-2 block">Bio</Label>
              <Textarea 
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-20 resize-none"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-70" />
                <Label htmlFor="show-email" className="text-sm cursor-pointer">
                  Show email on profile
                </Label>
              </div>
              <Switch 
                id="show-email"
                checked={showEmail}
                onCheckedChange={setShowEmail}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Appearance Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Theme</Label>
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Editor Preferences */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Editor Preferences</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <div>
              <Label htmlFor="default-lang" className="text-sm mb-2 block">Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger id="default-lang" className="w-full sm:w-64">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Privacy Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 opacity-70" />
                <Label htmlFor="public-profile" className="text-sm cursor-pointer">
                  Public profile
                </Label>
              </div>
              <Switch 
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 opacity-70" />
                <Label htmlFor="notifications" className="text-sm cursor-pointer">
                  Email notifications
                </Label>
              </div>
              <Switch 
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Security Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-password" className="text-sm mb-2 block">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="new-password" className="text-sm mb-2 block">New Password</Label>
                <Input 
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;