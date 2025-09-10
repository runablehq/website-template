import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

type NavbarLink = {
  to: string;
  label: string;
};

type NavbarProps = {
  brand?: string;
  links?: NavbarLink[];
  className?: string;
};

export function Navbar({ brand = "Brand", links = [], className }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [me, setMe] = useState<any | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/me')
        setMe(res.ok ? await res.json() : null)
      } catch {
        setMe(null)
      }
    })()
  }, [])

  async function doLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setMe(null)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
        className,
      )}
    >
      <div className="container mx-auto h-14 flex items-center justify-between px-6">
        <Link to="/" className="font-semibold tracking-tight">
          {brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "transition-colors relative", 
                isActive
                  ? "text-foreground after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </NavLink>
          ))}
          <span className="mx-1 opacity-30">|</span>
          {me ? (
            <>
              <span className="text-muted-foreground">{me?.user?.username ?? me?.username ?? 'user'}</span>
              <Button size="sm" variant="outline" onClick={doLogout}>Log out</Button>
            </>
          ) : (
            <>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Sign up</Link>
            </>
          )}
          <ThemeToggle compact />
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div id="mobile-nav" className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t pt-2">
              {me ? (
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm text-muted-foreground">{me?.user?.username ?? me?.username ?? 'user'}</span>
                  <Button size="sm" variant="outline" onClick={doLogout}>Log out</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">Sign in</Link>
                  <Link to="/" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">Sign up</Link>
                </div>
              )}
              <div className="mt-3">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

