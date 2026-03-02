import { Link } from "react-router";
import { Satellite } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Satellite className="h-16 w-16 text-muted-foreground opacity-40" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <p className="text-sm italic text-muted-foreground max-w-sm">
        LARVIS: "Hoo-man, that page does not exist in my database! Maybe it got
        lost in the void of space?"
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
