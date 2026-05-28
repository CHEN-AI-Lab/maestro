import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "For teachers just getting started.",
    features: ["Up to 5 students", "Basic calendar", "Manual invoicing", "Email support"],
    cta: "Get Started",
    href: "/signin",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For growing studios. Everything you need.",
    features: ["Unlimited students", "Recurring lesson scheduling", "Auto-generated invoices", "Stripe payments", "Student portal", "Priority support"],
    cta: "Start Free Trial",
    href: "/signin",
    featured: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    desc: "For multi-teacher studios.",
    features: ["Everything in Pro", "Multi-teacher accounts", "Revenue analytics", "Custom branding", "API access", "Dedicated support"],
    cta: "Contact Us",
    href: "/signin",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">Maestro</Link>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-600 mb-12">Start free, upgrade when your studio grows.</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {tiers.map((t) => (
            <div key={t.name} className={`bg-white rounded-xl border p-6 ${t.featured ? "ring-2 ring-indigo-600" : ""}`}>
              {t.featured && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mb-4 inline-block">Most Popular</span>}
              <h3 className="text-lg font-bold">{t.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold">{t.price}</span>
                {t.period && <span className="text-gray-500">{t.period}</span>}
              </div>
              <p className="text-sm text-gray-600 mb-4">{t.desc}</p>
              <ul className="space-y-2 mb-6">
                {t.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2">
                    <span className="text-green-500">Yes</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`block text-center py-2 rounded-lg text-sm font-medium ${
                t.featured ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-gray-300 hover:bg-gray-50"
              } transition-colors`}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
