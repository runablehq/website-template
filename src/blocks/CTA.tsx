import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CTAProps = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CTA({ title, subtitle, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CTAProps) {
  return (
    <section className="py-12 md:py-16 text-center">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-muted/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {primaryHref ? (
              <a href={primaryHref}>
                <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">{primaryLabel}</Button>
              </a>
            ) : (
              <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">{primaryLabel}</Button>
            )}
            {secondaryLabel && (
              secondaryHref ? (
                <a href={secondaryHref}>
                  <Button variant="outline" className="w-full sm:w-auto backdrop-blur-sm">{secondaryLabel}</Button>
                </a>
              ) : (
                <Button variant="outline" className="w-full sm:w-auto backdrop-blur-sm">{secondaryLabel}</Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default CTA;

