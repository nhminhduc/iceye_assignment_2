import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/features/profile/ProfileForm";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">
            Your Information
          </CardTitle>
          <CardDescription>
            Update your display name or change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
