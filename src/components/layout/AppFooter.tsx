export function AppFooter() {
  return (
    <footer className="border-t border-border/50 px-4 py-3 sm:px-8">
      <p className="text-[11px] text-muted-foreground/60 tracking-wide">
        LARVIS &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
