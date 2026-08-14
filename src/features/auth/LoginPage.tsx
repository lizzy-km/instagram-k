import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { createUserDoc } from "@/lib/firestore/createUser";
import { setUserOnlineStatus } from "@/lib/firestore/postActions";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { queryKeys } from "@/lib/query/keys";
import { Button, Input, Spinner } from "@/Components/ui";

interface LoginFormValues {
  name?: string;
  email: string;
  password: string;
}

const PASSWORD_RULES: { test: (pw: string) => boolean; message: string }[] = [
  { test: (pw) => pw.length >= 8, message: "At least 8 characters long." },
  { test: (pw) => /[A-Z]/.test(pw), message: "At least one uppercase letter." },
  { test: (pw) => /[a-z]/.test(pw), message: "At least one lowercase letter." },
  { test: (pw) => /[0-9]/.test(pw), message: "At least one number." },
  { test: (pw) => /[@$!%*?&#]/.test(pw), message: "At least one special character (@, $, !, %, *, ?, &, #)." },
];

function firstName(name: string): string[] {
  return name.split(" ").map((w) => w[0] ?? "");
}

export function LoginPage() {
  const queryClient = useQueryClient();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordIssues, setPasswordIssues] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pw = e.target.value;
    setPasswordIssues(PASSWORD_RULES.filter((rule) => !rule.test(pw)).map((rule) => rule.message));
  }

  function handleProfileImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  async function signUp(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const name = values.name ?? "";
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      let photoURL = "";
      const profile = [];

      if (profileImage) {
        const initials = firstName(name).join("");
        const fileSize = profileImage.size;
        const profileId = `${initials}PF${fileSize}`;
        const key = `user_photo/${user.uid}/${profileId}/${profileImage.name}`;
        photoURL = await uploadFileToR2(profileImage, key);
        profile.push({
          PPID: profileId,
          src: photoURL,
          isActive: true,
          isPublic: true,
          isPrivate: false,
          isFriendOnly: false,
        });
      }

      await createUserDoc({ uid: user.uid, email: values.email, name, profile });
      await updateProfile(user, { displayName: name, photoURL });
      // The auth state change fires as soon as createUserWithEmailAndPassword
      // resolves, which races the profile doc write above - without this,
      // the app's user-profile query can cache a "not found" result from
      // before this doc existed and not refetch for its full staleTime.
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.byUid(user.uid) });
      setIsSignUp(false);
    } catch {
      toast.error("Signup Failed!");
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      // Presence is best-effort - a failure here (e.g. the user doc not
      // existing yet) must not be reported as a login failure once auth
      // itself has already succeeded.
      setUserOnlineStatus(userCredential.user.uid, "online").catch(() => {});
    } catch {
      toast.error("Login Failed");
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = handleSubmit((values) => (isSignUp ? signUp(values) : signIn(values)));

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] px-4 py-10 text-[var(--color-text)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <img src="/Logo.svg" alt="Queed" className="h-10 w-10" />
          <h1 className="text-xl font-bold">{isSignUp ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {isSignUp ? "Sign up to start sharing with Queed" : "Log in to continue to Queed"}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-md)]">
          {isSignUp && (
            <div className="mb-5 flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)]">
                {imagePreviewUrl ? (
                  <img className="h-full w-full object-cover" src={imagePreviewUrl} alt="" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-text-faint)]" aria-hidden="true">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer text-sm font-medium text-[var(--color-accent)] hover:underline">
                {imagePreviewUrl ? "Change photo" : "Add a profile photo"}
                <input type="file" accept="image/*" onChange={handleProfileImageSelected} className="hidden" />
              </label>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                  Name
                </label>
                <Input id="name" {...register("name", { required: isSignUp })} required={isSignUp} />
                {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">Name is required</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                Email
              </label>
              <Input id="email" type="email" {...register("email", { required: true })} required />
              {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">Email is required</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true, onChange: handlePasswordChange })}
                required
              />
              {isSignUp && passwordIssues.length > 0 && (
                <ul className="mt-1.5 space-y-0.5 text-xs text-[var(--color-text-faint)]">
                  {passwordIssues.map((issue) => (
                    <li key={issue}>· {issue}</li>
                  ))}
                </ul>
              )}
              {errors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">Password is required</p>}
            </div>

            <Button type="submit" disabled={isLoading} size="lg" className="mt-1 w-full">
              {isLoading ? <Spinner size={18} /> : isSignUp ? "Sign up" : "Log in"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => setIsSignUp((v) => !v)} className="font-medium text-[var(--color-accent)] hover:underline">
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
