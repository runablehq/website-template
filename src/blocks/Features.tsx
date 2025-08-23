import { Card, CardContent } from "@/components/ui/card";

type FeatureItem = {
  title: string;
  description?: string;
  icon?: string; // emoji or short text label
};

type FeaturesProps = {
  title?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
};

export function Features({ title, items, columns = 3 }: FeaturesProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns];

  return (
    <section className="py-12 md:py-16">
      {title && <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{title}</h2>}
      <div className={`grid grid-cols-1 ${colClass} gap-6`}>
        {items.map((item, idx) => (
          <Card key={idx} className="bg-card/50 backdrop-blur-sm border-muted/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {item.icon && <div className="text-xl" aria-hidden>{item.icon}</div>}
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Features;

