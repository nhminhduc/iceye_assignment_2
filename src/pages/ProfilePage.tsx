import { ProfileForm } from "@/features/profile/ProfileForm";

export function ProfilePage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <div className="mt-4 max-w-md">
        <ProfileForm />
      </div>
    </>
  );
}
