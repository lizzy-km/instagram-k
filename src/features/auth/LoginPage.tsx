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
    <div className="flex relative flex-col justify-center items-center w-full h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <h1 className="text-2xl font-bold text-center mb-4">{isSignUp ? "Sign up with Queed" : "Login with Queed"}</h1>

      <div className="flex flex-col md:flex-row w-full gap-5 justify-center items-center h-screen bg-[var(--color-bg-elevated)] overflow-auto">
        {isSignUp && (
          <div className="w-full md:w-[30%] flex flex-col justify-start items-center gap-2 p-4">
            <p className="block text-lg tracking-wide font-medium">Select profile picture</p>
            <div className="h-[150px] w-[150px] flex rounded-full justify-center items-center overflow-hidden bg-[var(--color-surface)]">
              {imagePreviewUrl && <img className="object-cover w-full h-full" src={imagePreviewUrl} alt="" />}
            </div>
            <label className="relative cursor-pointer p-1 bg-yellow-600 rounded px-2 font-medium">
              Choose Photo
              <input type="file" accept="image/*" onChange={handleProfileImageSelected} className="absolute inset-0 opacity-0" />
            </label>
          </div>
        )}

        <div className="w-full md:w-[30%] p-4 bg-[var(--color-bg-elevated)] rounded-lg shadow-md">
          <form onSubmit={onSubmit}>
            {isSignUp && (
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input id="name" {...register("name", { required: isSignUp })} required={isSignUp} />
                {errors.name && <span className="flex p-2 italic text-red-500">Name is required</span>}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input id="email" type="email" {...register("email", { required: true })} required />
              {errors.email && <span className="flex p-2 italic text-red-500">Email is required</span>}
            </div>

            <div className="mb-6 flex flex-col w-full">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true, onChange: handlePasswordChange })}
                required
              />
              {isSignUp && passwordIssues.length > 0 && (
                <ul className="p-2 text-sm italic text-red-500">
                  {passwordIssues.map((issue) => (
                    <li key={issue}>* {issue}</li>
                  ))}
                </ul>
              )}
              {errors.password && <span className="flex p-2 italic text-red-500">Password is required</span>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full flex justify-center">
              {isLoading ? <Spinner size={20} /> : isSignUp ? "Sign up" : "Login"}
            </Button>

            <div className="text-center flex justify-center mt-4 gap-1">
              <span className="text-sm">{isSignUp ? "Already have an account?" : "You don't have any account?"}</span>
              <button type="button" onClick={() => setIsSignUp((v) => !v)} className="text-sm text-yellow-500 hover:underline">
                {isSignUp ? "Login" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
