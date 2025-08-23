import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cta = {
  label: string;
  href?: string;
};

type HeroProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  align?: "center" | "left";
  className?: string;
};

export function Hero({
  title,
  subtitle,
  kicker,
  primaryCta,
  secondaryCta,
  align = "center",
  className,
}: HeroProps) {
  const isCentered = align === "center";

  return (
    <section
      className={cn(
        "py-16 md:py-24",
        isCentered ? "text-center" : "text-left",
        className,
      )}
    >
      {kicker && (
        <div className={cn("text-xs uppercase tracking-wider text-muted-foreground", isCentered ? "mx-auto" : undefined)}>
          {kicker}
        </div>
      )}
      <h1 className={cn("mt-2 text-4xl md:text-6xl font-bold tracking-tight", isCentered ? "mx-auto" : undefined)}>
        {title}
      </h1>
      {subtitle && (
        <p className={cn("mt-4 max-w-2xl text-muted-foreground", isCentered ? "mx-auto" : undefined)}>
          {subtitle}
        </p>
      )}
      {(primaryCta || secondaryCta) && (
        <div className={cn("mt-8 flex flex-col sm:flex-row gap-3", isCentered ? "items-center justify-center" : undefined)}>
          {primaryCta && (
            primaryCta.href ? (
              <a href={primaryCta.href}>
                <Button className="shadow-md hover:shadow-lg transition-shadow">{primaryCta.label}</Button>
              </a>
            ) : (
              <Button className="shadow-md hover:shadow-lg transition-shadow">{primaryCta.label}</Button>
            )
          )}
          {secondaryCta && (
            secondaryCta.href ? (
              <a href={secondaryCta.href}>
                <Button variant="outline" className="backdrop-blur-sm">{secondaryCta.label}</Button>
              </a>
            ) : (
              <Button variant="outline" className="backdrop-blur-sm">{secondaryCta.label}</Button>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default Hero;

