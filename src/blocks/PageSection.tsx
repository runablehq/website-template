import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PageSectionProps = {
  title?: string;
  subtitle?: string;
  align?: "center" | "left";
  children?: ReactNode;
  className?: string;
};

export function PageSection({ title, subtitle, align = "left", children, className }: PageSectionProps) {
  const isCentered = align === "center";
  return (
    <section className={cn("py-12 md:py-16", className)}>
      {title && (
        <h2 className={cn("text-2xl md:text-3xl font-semibold", isCentered ? "text-center" : undefined)}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn("mt-2 text-muted-foreground max-w-2xl", isCentered ? "text-center mx-auto" : undefined)}>
          {subtitle}
        </p>
      )}
      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

export default PageSection;

