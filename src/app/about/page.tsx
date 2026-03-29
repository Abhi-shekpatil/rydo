export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">About Rydo</h1>
      <p className="text-gray-500 mb-8">India&apos;s intercity bike ride pooling platform</p>

      <div className="space-y-6 text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">What is Rydo?</h2>
          <p>
            Rydo connects motorcyclists traveling between cities so they can ride together, share fuel costs, and enjoy
            safer journeys with company. Whether you&apos;re heading from Pune to Goa or Delhi to Jaipur, find a co-rider
            going your way.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">How it works</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Post your upcoming ride with your route, date, and fuel cost.</li>
            <li>Other riders send you a fuel-sharing quote.</li>
            <li>Accept a quote, chat to coordinate, and ride together.</li>
            <li>After the ride, leave a review for your co-rider.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Safety</h2>
          <p>
            Every rider on Rydo provides their Aadhaar number and Driving License during registration. This helps ensure
            that everyone on the platform is a verified, licensed rider. We also show driving license numbers on ride
            listings so you can verify before you ride.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>
            For support or inquiries, reach us at{" "}
            <a href="mailto:hello@rydo.autos" className="text-accent hover:underline">
              hello@rydo.autos
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
