import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Tools Solutions</h3>
              <p className="text-sm text-muted-foreground">
                Sri Lanka's trusted source for professional-grade hand tools since 2020.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>123 Galle Road, Colombo 03</span>
              </div>
                            <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+94 75 244 1325</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>info@toolssolutions.lk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/auth/login"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <nav className="space-y-2">
              <Link
                href="/products?category=Wrenches"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Wrenches
              </Link>
              <Link
                href="/products?category=Screwdrivers"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Screwdrivers
              </Link>
              <Link
                href="/products?category=Pliers"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pliers
              </Link>
              <Link
                href="/products?category=Hammers"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Hammers
              </Link>
              <Link
                href="/products?category=Measuring Tools"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Measuring Tools
              </Link>
            </nav>
          </div>

          {/* Business Hours & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Store Hours</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 8:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Online orders 24/7
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Follow Us</h4>
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">© {currentYear} Tools Solutions. All rights reserved.</div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
