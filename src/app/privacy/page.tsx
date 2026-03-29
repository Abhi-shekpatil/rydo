export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Information We Collect</h2>
          <p>When you register, we collect:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Full name and phone number</li>
            <li>Aadhaar number and Driving License number (for identity verification)</li>
            <li>City and bike model (optional)</li>
          </ul>
          <p className="mt-2">
            When you use the platform, we also collect ride listings, quotes, messages, and reviews you create.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To operate the platform and match co-riders</li>
            <li>To verify your identity and prevent fraud</li>
            <li>To send OTP messages for account security</li>
            <li>To display your name and DL number to other users on ride listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Phone Number Visibility</h2>
          <p>
            Your phone number is partially masked on public ride listings. It is only shared when you choose to reveal
            it through the in-app chat.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Data Storage</h2>
          <p>
            Your data is stored securely on Supabase (PostgreSQL). Passwords are hashed using bcrypt and are never
            stored in plain text. We do not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Data Deletion</h2>
          <p>
            To request deletion of your account and data, contact us at{" "}
            <a href="mailto:hello@rydo.autos" className="text-accent hover:underline">
              hello@rydo.autos
            </a>
            . We will process requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>
            Privacy concerns?{" "}
            <a href="mailto:hello@rydo.autos" className="text-accent hover:underline">
              hello@rydo.autos
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
