import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  User,
  AtSign,
  Building2,
  BookOpen,
  Globe2,
  DollarSign,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  LayoutDashboard,
  Share2,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { apiGetUser } from "@/lib/api";
import type { UserProfile } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/student/$studentId")({
  head: () => ({
    meta: [
      { title: "Student Profile — Mentora" },
      {
        name: "description",
        content: "View and update your student profile, academic background, and study abroad preferences on Mentora.",
      },
    ],
  }),
  component: StudentProfilePage,
});

const SERVICE_OPTIONS = [
  "Profile Evaluation",
  "University Shortlisting",
  "SOP Feedback",
  "Scholarship Consultation",
  "Visa Interview Preparation",
  "Blocked Account & Financials",
  "Accommodation Assistance",
];

const TARGET_COUNTRIES = [
  "Germany",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Sweden",
  "Netherlands",
  "Japan",
  "Finland",
  "France",
  "Other",
];

const EDUCATION_LEVELS = [
  "High School / HSC / A-Levels",
  "Undergraduate / Bachelor's",
  "Graduate / Master's",
  "PhD / Post-Graduate",
];

const BUDGET_OPTIONS = [
  "Full Scholarship Required",
  "BDT 5–10 Lakhs / Year",
  "BDT 10–15 Lakhs / Year",
  "BDT 15–20 Lakhs / Year",
  "BDT 20–30 Lakhs / Year",
  "BDT 30+ Lakhs / Year",
  "Self-Funded / Flexible",
];

function cleanStudentIdentifier(raw: string): string {
  let cleaned = (raw || "").trim();
  if (cleaned.toLowerCase().startsWith("id=")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("@")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.trim();
}

function StudentProfilePage() {
  const params = useParams({ from: "/student/$studentId" });
  const rawIdentifier = params.studentId;
  const identifier = cleanStudentIdentifier(rawIdentifier);

  const { user: authUser, updateProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone_number: "",
    country: "Bangladesh",
    headline: "",
    bio: "",
    education_level: "",
    institution: "",
    subject_field: "",
    intended_country: "Germany",
    budget: "",
    services_needed: [] as string[],
  });

  const [originalData, setOriginalData] = useState<typeof formData | null>(null);

  const isOwner =
    authUser &&
    profile &&
    (authUser.id === profile.id ||
      (authUser.username && profile.username && authUser.username === profile.username) ||
      authUser.role === "admin");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setLoadError(null);

      try {
        // If current logged-in user matches the requested identifier, fast-path with authUser
        if (
          authUser &&
          (authUser.id === identifier ||
            authUser.username?.toLowerCase() === identifier.toLowerCase() ||
            cleanStudentIdentifier(authUser.id) === identifier)
        ) {
          if (isMounted) {
            initForm(authUser);
            setLoading(false);
          }
          return;
        }

        // Otherwise, fetch fresh from API
        const data = await apiGetUser(identifier);
        if (isMounted) {
          initForm(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          if (authUser && (identifier === "me" || identifier === "profile")) {
            initForm(authUser);
            setLoading(false);
          } else {
            setLoadError(err?.message || "Student profile not found.");
            setLoading(false);
          }
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [identifier, authUser?.id, authUser?.username]);

  function initForm(data: UserProfile) {
    setProfile(data);
    const initial = {
      full_name: data.full_name || "",
      username: data.username || "",
      phone_number: data.phone_number || "",
      country: data.country || "Bangladesh",
      headline: data.headline || "",
      bio: data.bio || "",
      education_level: data.education_level || "Undergraduate / Bachelor's",
      institution: data.institution || "",
      subject_field: data.subject_field || "",
      intended_country: data.intended_country || "Germany",
      budget: data.budget || "BDT 15–20 Lakhs / Year",
      services_needed: Array.isArray(data.services_needed) ? data.services_needed : [],
    };
    setFormData(initial);
    setOriginalData(initial);
  }

  const isDirty = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  function toggleService(service: string) {
    if (!isOwner) return;
    setFormData((prev) => {
      const exists = prev.services_needed.includes(service);
      return {
        ...prev,
        services_needed: exists
          ? prev.services_needed.filter((s) => s !== service)
          : [...prev.services_needed, service],
      };
    });
  }

  function handleDiscard() {
    if (originalData) {
      setFormData(originalData);
      toast.info("Changes reverted.");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!isOwner || !profile) return;

    // Validate username format if provided
    if (formData.username) {
      const cleanU = formData.username.trim().toLowerCase();
      if (!/^[a-z0-9_\-]{3,30}$/.test(cleanU)) {
        toast.error("Username must be 3–30 characters and contain only letters, numbers, hyphens or underscores.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: Partial<UserProfile> = {
        full_name: formData.full_name.trim(),
        username: formData.username ? formData.username.trim().toLowerCase() : undefined,
        phone_number: formData.phone_number.trim() || undefined,
        country: formData.country,
        headline: formData.headline.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        education_level: formData.education_level || undefined,
        institution: formData.institution.trim() || undefined,
        subject_field: formData.subject_field.trim() || undefined,
        intended_country: formData.intended_country,
        budget: formData.budget || undefined,
        services_needed: formData.services_needed,
      };

      const updated = await updateProfile(payload, profile.id);
      setProfile(updated);
      initForm(updated);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function copyProfileLink() {
    const handle = profile?.username || profile?.id;
    const url = `${window.location.origin}/student/${handle}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading student profile...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-foreground">Profile Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {loadError || `We couldn't find a student profile matching "${identifier}".`}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
              {authUser && (
                <Button asChild>
                  <Link to="/student/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1 pb-16">
        {/* Top Cover Banner */}
        <div className="relative h-48 sm:h-60 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-4 left-4 sm:left-8">
            <Button asChild variant="ghost" size="sm" className="bg-background/80 backdrop-blur-xs hover:bg-background">
              <Link to="/student/dashboard">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header Card with Avatar & Quick Actions */}
          <div className="relative -mt-20 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-primary text-primary-foreground text-3xl font-extrabold flex items-center justify-center ring-4 ring-card shadow-lg">
                    {profile.full_name?.slice(0, 2).toUpperCase() || "ST"}
                  </div>
                  <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center p-1.5 rounded-full bg-primary text-primary-foreground ring-2 ring-card" title="Verified Student">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                      {formData.full_name || profile.full_name}
                    </h1>
                    {formData.username && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary">
                        <AtSign className="h-3 w-3" />
                        {formData.username}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Student
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
                    {formData.headline || "Mentora Student • Aspiring International Scholar"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {formData.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5 text-primary" /> Target: <strong className="text-foreground">{formData.intended_country}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyProfileLink}
                  title="Share profile link"
                  className="font-bold"
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                </Button>

                {isOwner ? (
                  <Button
                    type="submit"
                    form="profile-form"
                    disabled={!isDirty || saving}
                    className="font-bold shadow-lift"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <Link to="/student/dashboard">
                      <LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Read-only Banner if viewing someone else's profile */}
            {!isOwner && (
              <div className="mt-6 rounded-2xl bg-secondary/70 border border-primary/20 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                <span>You are currently viewing this student profile in <strong>read-only public mode</strong>. Only the account owner can modify these details.</span>
              </div>
            )}

            {/* Unsaved Changes Indicator */}
            {isOwner && isDirty && (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>You have unsaved changes on your profile. Don't forget to save before leaving.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDiscard}
                    disabled={saving}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" /> Revert
                  </Button>
                  <Button
                    type="submit"
                    form="profile-form"
                    size="sm"
                    disabled={saving}
                    className="h-7 text-xs font-bold shadow-xs"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Main Profile Form Body */}
          <form id="profile-form" onSubmit={handleSave} className="mt-8 space-y-8">
            {/* 1. Basic & Contact Information */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">Personal & Contact Information</h2>
                  <p className="text-xs text-muted-foreground">Manage your identity handle, contact info, and public headline.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    required
                    disabled={!isOwner}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Rafiul Islam"
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Username Handle (@handle)
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm font-semibold">
                      @
                    </span>
                    <Input
                      id="username"
                      disabled={!isOwner}
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_\-]/g, ""),
                        })
                      }
                      placeholder="e.g. rafiul"
                      className="pl-8 font-medium font-mono text-sm"
                    />
                  </div>
                  <p className="text-[0.6875rem] text-muted-foreground">
                    Your public profile address: <code className="text-primary font-mono font-semibold">mentora.com/student/{formData.username || profile.id}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      disabled
                      value={profile.email}
                      className="pl-9 bg-secondary/50 font-medium text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[0.6875rem] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Primary login email is verified.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Phone Number (WhatsApp)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      disabled={!isOwner}
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="pl-9 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="headline" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Headline / One-Line Intro
                  </Label>
                  <Input
                    id="headline"
                    disabled={!isOwner}
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. BUET CSE graduate seeking Fall 2026 Master's in Germany (TU9)"
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Bio & Study Abroad Objectives
                  </Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    disabled={!isOwner}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Briefly describe your academic background, test scores (IELTS/GRE), and what kind of mentor guidance you are looking for..."
                    className="font-medium text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Academic Background & Study Abroad Goals */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">Academic Profile & Destination Goals</h2>
                  <p className="text-xs text-muted-foreground">Used by Mentora's matching algorithm to recommend verified mentors.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="education_level" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Current Education Level
                  </Label>
                  {isOwner ? (
                    <Select
                      value={formData.education_level}
                      onValueChange={(val) => setFormData({ ...formData, education_level: val })}
                    >
                      <SelectTrigger className="font-medium">
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input disabled value={formData.education_level} className="font-medium" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Current Institution / College
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="institution"
                      disabled={!isOwner}
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. BUET, Dhaka University, NSU"
                      className="pl-9 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject_field" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Subject Field / Major
                  </Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subject_field"
                      disabled={!isOwner}
                      value={formData.subject_field}
                      onChange={(e) => setFormData({ ...formData, subject_field: e.target.value })}
                      placeholder="e.g. Computer Science, Mechanical Engineering, BBA"
                      className="pl-9 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intended_country" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Target Destination Country
                  </Label>
                  {isOwner ? (
                    <Select
                      value={formData.intended_country}
                      onValueChange={(val) => setFormData({ ...formData, intended_country: val })}
                    >
                      <SelectTrigger className="font-medium">
                        <SelectValue placeholder="Select Destination Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input disabled value={formData.intended_country} className="font-medium" />
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Annual Tuition / Living Budget
                  </Label>
                  {isOwner ? (
                    <Select
                      value={formData.budget}
                      onValueChange={(val) => setFormData({ ...formData, budget: val })}
                    >
                      <SelectTrigger className="font-medium">
                        <SelectValue placeholder="Select Budget Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_OPTIONS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input disabled value={formData.budget} className="font-medium" />
                  )}
                </div>
              </div>
            </div>

            {/* 3. Services / Mentorship Needed */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">Mentorship & Services Needed</h2>
                  <p className="text-xs text-muted-foreground">Select the application areas where you would like 1-on-1 mentor guidance.</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2.5">
                  {SERVICE_OPTIONS.map((service) => {
                    const selected = formData.services_needed.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        disabled={!isOwner}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                          selected
                            ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary"
                            : "border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        } ${!isOwner ? "cursor-default opacity-80" : "cursor-pointer"}`}
                      >
                        {selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-border" />}
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Account Metadata & Security Card */}
            <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">User ID:</span>
                  <code className="font-mono bg-secondary px-2 py-0.5 rounded text-[0.6875rem]">{profile.id}</code>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">Account Status:</span>
                  <span className="capitalize font-bold text-emerald-600 dark:text-emerald-400">{profile.account_status || "Active"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">Last Updated:</span>
                  <span>{profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "Recently"}</span>
                </div>
              </div>
            </div>

            {/* Sticky Save Bar on mobile when dirty */}
            {isOwner && isDirty && (
              <div className="sticky bottom-4 z-30 sm:hidden rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-foreground">Unsaved Changes</div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={handleDiscard}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={saving} className="font-bold">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
