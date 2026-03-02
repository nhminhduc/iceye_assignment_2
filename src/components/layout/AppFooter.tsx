export function AppFooter() {
  return (
    <footer className="border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        LARVIS &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
