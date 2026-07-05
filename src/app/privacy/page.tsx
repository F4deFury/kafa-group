import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | KAFA Group",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-navy">Privacy Policy</h1>
      <p className="mb-10 text-sm text-navy/50">Last updated: July 5, 2026</p>

      <div className="space-y-8 text-navy/80">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">1. Information We Collect</h2>
          <p className="mb-3">We collect information in the following ways:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium text-navy">Contact form submissions</span> — name,
              company, email, phone number, and message content you provide when
              reaching out to us.
            </li>
            <li>
              <span className="font-medium text-navy">Client account information</span> — name,
              company, phone number, and project details for individuals we set up
              with portal access.
            </li>
            <li>
              <span className="font-medium text-navy">Live chat</span> — conversations you have
              with us through our Tawk.to chat widget, which may set cookies to
              maintain your chat session across page views.
            </li>
            <li>
              <span className="font-medium text-navy">Basic site analytics</span> — general,
              non-identifying usage data such as pages viewed, used to understand
              how visitors use the Site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">2. How We Use Information</h2>
          <p>
            We use the information collected to respond to inquiries, manage
            client accounts and project communication, provide live chat
            support, and improve the Site. We do not sell your personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">3. Cookies</h2>
          <p>
            The Site uses cookies from our live chat provider, Tawk.to, to
            maintain chat sessions, and may use basic analytics cookies to
            understand aggregate site traffic. You can control cookie
            preferences through the cookie banner shown on your first visit,
            or through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">4. Third-Party Services</h2>
          <p>
            We use the following third-party services to operate the Site:
            Supabase (account authentication and data storage), Vercel
            (hosting), and Tawk.to (live chat). Each of these providers
            processes data according to their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">5. Data Retention</h2>
          <p>
            Contact form submissions and client account data are retained for
            as long as reasonably necessary to serve our business
            relationship with you, or as required by law. You may request
            deletion of your information by contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of personal
            information we hold about you by emailing{" "}
            <a href="mailto:office@kafagroup.com" className="text-gold underline">
              office@kafagroup.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Material changes
            will be reflected by updating the date at the top of this page.
            See also our{" "}
            <Link href="/terms" className="text-gold underline">
              Terms of Service
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">8. Contact</h2>
          <p>
            Questions about this Privacy Policy can be directed to{" "}
            <a href="mailto:office@kafagroup.com" className="text-gold underline">
              office@kafagroup.com
            </a>{" "}
            or (203) 333-0090.
          </p>
        </section>
      </div>
    </div>
  );
}
