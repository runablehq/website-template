import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hero } from "@/blocks/Hero";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <Hero
        kicker="About"
        title="About Us"
        subtitle="Brief description about your company or project."
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
            <CardDescription>Short description</CardDescription>
          </CardHeader>
          <CardContent>
            Replace this text with a brief paragraph describing this topic.
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
            <CardDescription>Short description</CardDescription>
          </CardHeader>
          <CardContent>
            Replace this text with a brief paragraph describing this topic.
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
            <CardDescription>Short description</CardDescription>
          </CardHeader>
          <CardContent>
            Replace this text with a brief paragraph describing this topic.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
