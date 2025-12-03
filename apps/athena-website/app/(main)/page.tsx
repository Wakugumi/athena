"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import Logo from "../_components/Logo";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuth())
      router.push('/market')
  }, [])
  return (
    <>
      <section className="bg-background" id="home">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-foreground">
                Share, Trade, and
                <br />
                Access Quality Lecture
                <br />
                Notes
              </h1>
              <p className="text-lg text-secondary max-w-prose">
                Take notes with speech-to-text, sync across devices, and access a global marketplace of
                student notes. Earn tokens by sharing your notes with others.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button color="primary">Get Started</Button>
                </Link>
                <Link href="/market">
                  <Button color="light">Browse Marketplace</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1920&auto=format&fit=crop"
                  alt="Notebook with records"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-surface" id="features">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-secondary">Everything you need to excel</h2>
            <p className="mt-2 text-foreground text-lg font-semibold">From AI-powered summaries to a global note-sharing marketplace, we&apos;ve got you covered.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              title: "Speech-to-Text",
              desc: "Convert your spoken words into written notes instantly so you can focus on listening.",
            }, {
              title: "Cross-Device Sync",
              desc: "Access your notes anywhere—seamlessly sync between phone, tablet, and desktop.",
            }, {
              title: "Earn Tokens",
              desc: "Submit quality notes to earn tokens and access premium content from others.",
            }, {
              title: "Multi-University Network",
              desc: "Connect with students globally and gain diverse perspectives and resources.",
            }].map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 text-secondary-800">{i + 1}</div>
                <div className="font-medium text-foreground">{f.title}</div>
                <p className="mt-1 text-sm leading-6 text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-secondary">How it works</h2>
            <p className="mt-2 text-foreground text-lg font-semibold">Four simple steps to transform your learning experience</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '01', title: 'Take Notes Your Way', desc: 'Use our notepad with speech-to-text during lectures. Type or speak—your notes sync across devices.' },
              { n: '02', title: 'Format with Markdown', desc: 'Keep everything structured and easy to read with Markdown support.' },
              { n: '03', title: 'Earn & Spend Tokens', desc: 'Earn by sharing high-quality notes and use tokens to access other students’ notes.' },
              { n: '04', title: 'Excel in Your Studies', desc: 'Build a knowledge base and collaborate with students worldwide.' },
            ].map((s, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-surface p-5 shadow-sm">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 text-secondary-800">{i + 1}</div>
                <div className="font-medium text-foreground">{s.title}</div>
                <p className="mt-1 text-sm leading-6 text-secondary">{s.desc}</p>
                <div className="absolute right-4 top-4 text-3xl font-semibold text-secondary-300 select-none">{s.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary text-primary-text">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">Ready to transform your learning?</h2>
          <p className="mt-2 text-primary-text/90">Join thousands of students earning tokens and sharing knowledge with Athena</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="register">
              <Button color="light">Get Started</Button>
            </Link>
            <Link href="market">
              <Button color="light" className="bg-transparent border border-primary-text text-primary-text hover:bg-primary-800">Browse Marketplace</Button>
            </Link>
          </div>
        </div>
      </section>
      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="mb-3"><Logo variant="inline" /></div>
              <p className="text-sm text-secondary max-w-xs">Share, Trade, and Access Quality Lecture Notes.</p>
            </div>
            <div>
              <div className="font-medium text-foreground">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                <li><a href="#about" className="hover:text-foreground">About Us</a></li>
                <li><a href="#how" className="hover:text-foreground">How it works</a></li>
                <li><a href="#community" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground">Support</div>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                <li><a href="#help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#feedback" className="hover:text-foreground">Submit Feedback</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground">Learn</div>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                <li><a href="#newsroom" className="hover:text-foreground">Newsroom</a></li>
                <li><a href="#events" className="hover:text-foreground">Events</a></li>
                <li><a href="#donate" className="hover:text-foreground">Donate</a></li>
              </ul>
            </div>
          </div>

        </div>
      </footer>

    </>
  );
}
