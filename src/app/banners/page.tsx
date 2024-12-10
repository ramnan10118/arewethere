import { Leaderboard728x90, Rectangle300x250, Skyscraper160x600, LargeRectangle336x280, InstagramStory1080x1920 } from '../../components/Banner/GoogleBanners';

export default function Page() {
  const bannerProps = {
    logo: {
      src: "/placeholder-logo.png",
      alt: "Company Logo"
    },
    title: "Transform Your Business with AI",
    subtitle: "Boost productivity and efficiency with our AI solutions",
    cta: "Get Started"
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-900">
        Google Ad Banners
      </h1>
      
      <div className="max-w-[1000px] mx-auto space-y-12">
        {/* Leaderboard Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Leaderboard (728x90)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Leaderboard728x90 {...bannerProps} />
          </div>
        </section>

        {/* Medium Rectangle Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Medium Rectangle (300x250)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Rectangle300x250 {...bannerProps} />
          </div>
        </section>

        {/* Large Rectangle Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Large Rectangle (336x280)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <LargeRectangle336x280 {...bannerProps} />
          </div>
        </section>

        {/* Skyscraper Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Skyscraper (160x600)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Skyscraper160x600 {...bannerProps} />
          </div>
        </section>

        {/* Instagram Story Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Instagram Story (1080x1920)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <InstagramStory1080x1920 {...bannerProps} />
          </div>
        </section>
      </div>
    </main>
  );
} 