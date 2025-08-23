import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type FooterLink = { to: string; label: string };

type FooterProps = {
  brand?: string;
  year?: number;
  links?: FooterLink[];
  className?: string;
};

export function Footer({ brand = "Brand", year = new Date().getFullYear(), links = [], className }: FooterProps) {
  return (
    <footer className={cn("border-t bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40", className)}>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">© {year} {brand}. All rights reserved.</div>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

