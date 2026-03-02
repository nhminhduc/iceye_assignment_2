export function AppFooter() {
  return (
    <footer className="border-t px-4 py-4 sm:px-8">
      <p className="text-xs text-muted-foreground">
        LARVIS &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
