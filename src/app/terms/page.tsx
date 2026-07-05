import Link from "next/link";

export const metadata = {
  title: "Terms of Service | KAFA Group",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-navy">Terms of Service</h1>
      <p className="mb-10 text-sm text-navy/50">Last updated: July 5, 2026</p>

      <div className="space-y-8 text-navy/80">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">1. Overview</h2>
          <p>
            These Terms of Service ("Terms") govern your use of the KAFA Group
            website located at kafagroup.com (the "Site"), operated by KAFA
            Group, a construction management and general contracting firm
            based in Bridgeport, Connecticut. By accessing or using the Site,
            you agree to these Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">2. Use of the Site</h2>
          <p>
            The Site provides information about KAFA Group and its real
            estate division, KG Enterprise, including our services, project
            portfolio, and company background. You may browse this
            information freely. You agree not to misuse the Site, attempt to
            gain unauthorized access to any portion of it, or use it for any
            unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">3. Client Accounts</h2>
          <p>
            Certain areas of the Site are restricted to clients and staff of
            KAFA Group. Client accounts are created by KAFA Group staff and
            are not available through public self-registration. If you are
            issued login credentials, you are responsible for keeping them
            confidential and for all activity under your account. Access to
            project information through your account is provided as a
            courtesy tied to your active engagement with KAFA Group and may
            be modified or revoked at our discretion.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">4. Contact Form Submissions</h2>
          <p>
            Information submitted through our contact form is used solely to
            respond to your inquiry and evaluate potential projects. See our{" "}
            <Link href="/privacy" className="text-gold underline">
              Privacy Policy
            </Link>{" "}
            for details on how this information is handled.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">5. Intellectual Property</h2>
          <p>
            All content on this Site, including text, images, project
            photography, and branding, is the property of KAFA Group unless
            otherwise noted, and may not be reproduced or used without
            written permission.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">6. No Warranty</h2>
          <p>
            The Site and its content are provided "as is." While we make
            reasonable efforts to keep information accurate and current,
            KAFA Group makes no warranty as to the completeness or accuracy
            of any information on the Site, including project details and
            company descriptions.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">7. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of
            the Site after changes are posted constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-navy">8. Contact</h2>
          <p>
            Questions about these Terms can be directed to{" "}
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
