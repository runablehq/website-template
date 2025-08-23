import { PageSection } from "@/blocks/PageSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SITE_NAME } from "@/constants";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <PageSection
        title={`About ${SITE_NAME}`}
        subtitle={`Short paragraph introducing the brand, product, or team.`}
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section title</CardTitle>
            <CardDescription>Short description</CardDescription>
          </CardHeader>
          <CardContent>
            Replace this text with a brief paragraph describing this topic.
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section title</CardTitle>
            <CardDescription>Short description</CardDescription>
          </CardHeader>
          <CardContent>
            Replace this text with a brief paragraph describing this topic.
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-muted/50">
          <CardHeader>
            <CardTitle>Section title</CardTitle>
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


