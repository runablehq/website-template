import { APITester } from "@/APITester";
import { Auth } from "@/blocks/Auth";
import { Hero } from "@/blocks/Hero";
import { PageSection } from "@/blocks/PageSection";

export default function Home() {
  return (
    <main className="container mx-auto px-6">
      <div className="flex flex-col gap-20 md:gap-28">
        <Hero
          kicker="Welcome"
          title="Your Headline Here"
          subtitle="A short description or tagline goes here."
          primaryCta={{ label: "Primary Action" }}
          secondaryCta={{ label: "Secondary Action" }}
          align="center"
        />

        <PageSection
          title="Section Title"
          subtitle="Short supporting sentence explaining this section."
          align="center"
        >
          <APITester />
        </PageSection>

        <PageSection title="Authentication" align="center">
          <Auth />
        </PageSection>
      </div>
    </main>
  );
}
