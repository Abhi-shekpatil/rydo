export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance</h2>
          <p>
            By creating an account on Rydo, you agree to these Terms of Service. If you do not agree, do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Eligibility</h2>
          <p>
            You must hold a valid Indian driving license and be at least 18 years old to use Rydo. By registering, you
            confirm that the Aadhaar and driving license details you provide are accurate and belong to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Ride Sharing</h2>
          <p>
            Rydo is a platform for connecting co-riders. We do not operate rides, employ riders, or guarantee the safety
            of any ride. All arrangements are made directly between users. Rydo is not responsible for any accidents,
            losses, or disputes arising from rides arranged through the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Payments</h2>
          <p>
            All fuel cost sharing is agreed upon and settled directly between riders. Rydo does not process or hold any
            payments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibent text-white mb-2">5. Prohibited Conduct</h2>
          <p>You must not use Rydo to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Provide false identity or document information</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Use the platform for commercial transport or taxi services</li>
            <li>Post fraudulent or misleading ride listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or are reported for misuse.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2>
          <p>
            Questions about these terms?{" "}
            <a href="mailto:hello@rydo.autos" className="text-accent hover:underline">
              hello@rydo.autos
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
