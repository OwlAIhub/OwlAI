"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/buttons/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
    OnboardingProfile,
    getOnboardingProfile,
} from "@/lib/services/onboardingService";
import { updateUserProfile } from "@/lib/services/userService";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Edit3,
    Globe,
    Phone,
    Save,
    Settings,
    Target,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Toast functionality - using simple alerts for now

export default function ProfilePage() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const [onboardingProfile, setOnboardingProfile] =
    useState<OnboardingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const loadProfileData = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000),
        );

        const onboarding = (await Promise.race([
          getOnboardingProfile(user.uid),
          timeoutPromise,
        ])) as OnboardingProfile | null;

        setOnboardingProfile(onboarding);

        // Initialize form data
        setFormData({
          displayName: userProfile?.displayName || "",
          email: userProfile?.email || "",
        });
      } catch (error) {
        console.error("Error loading profile data:", error);
        // Continue without onboarding data if it fails
        setOnboardingProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, userProfile, router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        email: formData.email,
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]" />

      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Profile Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 h-full">
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="md:col-span-1"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-border/40">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {user.phoneNumber?.slice(-2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-lg">
                    {formData.displayName || "User"}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" />
                    {user.phoneNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {onboardingProfile && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Exam
                        </span>
                        <Badge variant="secondary">
                          {onboardingProfile.exam}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Subject
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {onboardingProfile.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Attempt
                        </span>
                        <Badge variant="outline">
                          {onboardingProfile.attempt}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Language
                        </span>
                        <Badge variant="outline">
                          {onboardingProfile.language}
                        </Badge>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">
                      {userProfile?.createdAt
                        ? new Date(
                            userProfile.createdAt.seconds * 1000,
                          ).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="md:col-span-2 space-y-3 overflow-hidden"
            >
              {/* Personal Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-border/40">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Enter your display name"
                        className="bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Enter your email"
                        className="bg-white/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={user.phoneNumber || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Phone number cannot be changed. Contact support if needed.
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Preferences
                  </CardTitle>
                  <CardDescription>
                    Your educational settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {onboardingProfile ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Target Exam</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {onboardingProfile.exam}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {onboardingProfile.subject}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Attempt Number</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {onboardingProfile.attempt}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Language</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {onboardingProfile.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No learning preferences found
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/onboarding")}
                      >
                        Complete Onboarding
                      </Button>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      Want to change your learning preferences?
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/onboarding")}
                    >
                      Update Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
