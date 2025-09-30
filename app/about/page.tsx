import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Award, Users, Wrench, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="outline" className="text-sm px-4 py-2">
            Established 2020
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">About Tools Solutions</h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Your trusted partner for professional-grade hand tools in Sri Lanka
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-balance">Our Story</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Founded in 2020, Tools Solutions began with a simple mission: to provide Sri Lankan professionals and
              enthusiasts with access to high-quality hand tools at honest prices.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              What started as a small family business has grown into Sri Lanka's trusted source for professional-grade
              tools. We understand that the right tool can make all the difference in your work, whether you're a
              seasoned craftsman or a weekend DIY enthusiast.
            </p>
            <p className="text-muted-foreground">
              Today, we serve thousands of customers across the island, from Colombo to Jaffna, providing not just
              tools, but the reliability and support that professionals demand.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <Wrench className="h-24 w-24 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-balance">Our Values</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Quality First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We source only the finest tools from trusted manufacturers, ensuring every product meets our rigorous
                quality standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Customer Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your success is our success. We provide expert advice, reliable support, and solutions tailored to your
                specific needs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Fair Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional-grade tools shouldn't break the bank. We offer competitive prices without compromising on
                quality.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 rounded-lg p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-balance">Why Choose Tools Solutions</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            More than just a tool supplier - we're your partners in success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fast Island-wide Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and reliable delivery to all provinces in Sri Lanka, with same-day dispatch for Colombo orders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Comprehensive Warranty</h3>
                <p className="text-sm text-muted-foreground">
                  All tools come with manufacturer warranty plus our own quality guarantee for complete peace of mind.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our team of tool specialists is always ready to help you choose the right tools for your projects.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Curated Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Every tool in our catalog is carefully selected and tested to ensure it meets professional standards.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Trusted by Professionals</h3>
                <p className="text-sm text-muted-foreground">
                  From construction companies to individual craftsmen, professionals across Sri Lanka trust our tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Local Understanding</h3>
                <p className="text-sm text-muted-foreground">
                  We understand the unique challenges of working in Sri Lankan conditions and stock tools accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-balance">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Whether you're starting a new project or expanding your toolkit, we're here to help you find the perfect
            tools.
          </p>
        </div>
      </section>
    </div>
  )
}
