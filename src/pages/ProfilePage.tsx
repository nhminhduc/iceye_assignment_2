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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card className="max-w-lg rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
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
