"use client";

import { useState, useTransition } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { submitContactForm } from "./actions";

export default function Contact() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitContactForm(formData);
      setResult(res);
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Connect With Us</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Let&rsquo;s Build Something Great Together</h1>
        <p className="mt-6 max-w-2xl text-cream/70">
          For any inquiries, questions, or commendations, call us or fill out
          the form below and our team will respond promptly.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-gold" />
              <div>
                <p className="font-medium">Main Office</p>
                <p className="text-sm text-cream/60">800 Union Ave, Bridgeport, CT 06607</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-gold" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-cream/60">
                  <a href="tel:+12033330090" className="hover:text-gold">(203) 333-0090</a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-gold" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-cream/60">
                  <a href="mailto:office@kafagroup.com" className="hover:text-gold">office@kafagroup.com</a>
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="font-medium">Employment</p>
              <p className="text-sm text-cream/60">
                To apply for a job with KAFA Group, send a cover letter and
                CV to{" "}
                <a href="mailto:office@kafagroup.com" className="text-gold hover:text-gold-light">
                  office@kafagroup.com
                </a>
                .
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form action={handleSubmit} className="space-y-4 rounded-md border border-black/10 bg-navy-card p-6">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            {result?.success ? (
              <p className="text-gold">{result.message}</p>
            ) : (
              <>
                {result && !result.success && (
                  <p className="rounded-sm border border-red-400/40 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {result.message}
                  </p>
                )}
                <input name="company" required placeholder="Company Name" className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-cream focus:border-gold focus:outline-none" />
                <input name="full_name" required placeholder="Full Name" className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-cream focus:border-gold focus:outline-none" />
                <input name="email" required type="email" placeholder="Email" className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-cream focus:border-gold focus:outline-none" />
                <input name="phone" required type="tel" placeholder="Phone" className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-cream focus:border-gold focus:outline-none" />
                <textarea name="message" required placeholder="How can we assist you?" rows={5} className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-cream focus:border-gold focus:outline-none" />
                <button type="submit" disabled={isPending} className="w-full rounded-sm bg-gold px-6 py-3 font-medium text-navy transition hover:bg-gold-light disabled:opacity-60">
                  {isPending ? "Sending..." : "Submit"}
                </button>
                <p className="pt-1 text-center text-sm text-cream/50">
                  Already a client?{" "}
                  <Link href="/sign-in" className="text-gold hover:underline">
                    Sign in here
                  </Link>
                  .
                </p>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}
