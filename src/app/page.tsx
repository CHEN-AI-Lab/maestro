import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Maestro
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-500">{session.user?.name}</span>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Your Studio,<br /><span className="text-indigo-600">Beautifully Organized</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Schedule lessons, track payments, and manage students - all in one place.
            Built for private music teachers who want less admin and more teaching.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signin"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-24 grid md:grid-cols-3 gap-8">
          {[
            { title: "Smart Scheduling", desc: "Calendar with recurring lessons, conflicts detection, and student reminders." },
            { title: "Easy Billing", desc: "Auto-generate invoices from lessons. Accept card payments via Stripe." },
            { title: "Student Portal", desc: "Students see their schedule, pay invoices, and track progress." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        Maestro &copy; {new Date().getFullYear()}. Built for music teachers.
      </footer>
    </div>
  );
}
