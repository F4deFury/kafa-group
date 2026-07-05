import Link from "next/link";
import { Building2, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-navy-light">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gold" />
              <span className="text-lg font-semibold">
                KAFA <span className="text-gold">GROUP</span>
              </span>
            </div>
            <p className="text-sm text-cream/60">
              Together building communities.
            </p>
            <div className="mt-4 flex gap-4 text-cream/60">
              <a
                href="https://www.linkedin.com/in/kafa-group-0814138/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KAFA Group on LinkedIn"
                className="transition hover:text-gold"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gold">Company</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href="/about" className="hover:text-gold">Our Story</Link></li>
              <li><Link href="/projects" className="hover:text-gold">Projects</Link></li>
              <li><Link href="/contact" className="hover:text-gold">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gold">Services</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href="/services" className="hover:text-gold">Construction Management</Link></li>
              <li><Link href="/services" className="hover:text-gold">General Contracting</Link></li>
              <li><Link href="/real-estate" className="hover:text-gold">KG Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li>800 Union Ave, Bridgeport, CT 06607</li>
              <li><a href="tel:+12033330090" className="hover:text-gold">(203) 333-0090</a></li>
              <li><a href="mailto:office@kafagroup.com" className="hover:text-gold">office@kafagroup.com</a></li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-8" />
        <div className="flex flex-col items-center gap-2 text-center text-xs text-cream/40 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} KAFA Group. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gold">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
