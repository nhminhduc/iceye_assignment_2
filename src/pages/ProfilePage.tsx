import { ProfileForm } from "@/features/profile/ProfileForm";

export function ProfilePage() {
  return (
    <>
      <h1>Profile</h1>
      <div style={{ maxWidth: 400 }}>
        <ProfileForm />
      </div>
    </>
  );
}
