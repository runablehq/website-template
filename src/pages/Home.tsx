import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Auth } from "@/blocks/Auth";
import { Hero } from "@/blocks/Hero";
import { Features } from "@/blocks/Features";
import { CTA } from "@/blocks/CTA";
import { APITester } from "@/APITester";
import { PageSection } from "@/blocks/PageSection";
import { SITE_NAME } from "@/constants";
import { useEffect, useState } from "react";

export default function Home() {
  const [me, setMe] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setMe(data?.user ?? data);
        } else {
          setMe(null);
        }
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMe(null);
  }

  return (
    <main className="container mx-auto px-6">
      <div className="flex flex-col gap-20 md:gap-28">
        <Hero
          kicker="Kicker text"
          title={`${SITE_NAME}`}
          subtitle="Short subtitle describing the product or service."
          primaryCta={{ label: "Primary action" }}
          secondaryCta={{ label: "Secondary action" }}
          className="min-h-[calc(100vh-56px)] flex flex-col justify-center"
        />

        <Features
          title="Section title"
          items={[
            { title: "Feature title", description: "One sentence description of the feature.", icon: "✨" },
            { title: "Feature title", description: "One sentence description of the feature.", icon: "⚡" },
            { title: "Feature title", description: "One sentence description of the feature.", icon: "🛠️" },
            { title: "Feature title", description: "One sentence description of the feature.", icon: "♿" },
            { title: "Feature title", description: "One sentence description of the feature.", icon: "📱" },
            { title: "Feature title", description: "One sentence description of the feature.", icon: "🎛️" },
          ]}
          columns={3}
        />

        <PageSection title="Section title" subtitle="Short supporting sentence explaining this section." align="center">
          <APITester />
        </PageSection>

        <CTA
          title="Call to action title"
          subtitle="One sentence explaining why to click."
          primaryLabel="Primary action"
          secondaryLabel="Secondary action"
        />

        <PageSection align="center">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" aria-label="Loading" />
            </div>
          ) : me ? (
            <Card className="max-w-md mx-auto bg-card/50 backdrop-blur border-muted/50">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <p className="text-muted-foreground">Signed in as <span className="text-foreground font-medium">{me?.user?.username ?? me?.username ?? 'user'}</span></p>
                <Button onClick={logout}>Log out</Button>
              </CardContent>
            </Card>
          ) : (
            <Auth />
          )}
        </PageSection>
      </div>
    </main>
  );
}
