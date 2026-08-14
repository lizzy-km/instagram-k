import { NavLink } from "react-router-dom";
import { EmptyState } from "@/Components/ui";

export function NotFoundPage() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or was moved."
        action={
          <NavLink to="/" className="text-[var(--color-accent)] hover:underline">
            Go home
          </NavLink>
        }
      />
    </div>
  );
}
