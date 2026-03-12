import { Header } from "../components/header";
import { Footer } from "../components/footer";
import mainImage from "../../assets/b5f233cfc8ac110d15bad0f17fc6d160b955919a.png";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#d4f4dd]">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-24">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-6">
              A safe space to report bullying and get support
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Submit anonymous reports, find peer support, and access mental health
              resources in a safe digital community.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/report")}
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
              >
                Report anonymously
              </button>

              <button
                onClick={() => navigate("/forum")}
                className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100"
              >
                Explore support forum
              </button>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-8 justify-center mb-8">
              <button
                onClick={() => navigate("/community-guidelines")}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
                </svg>
                <span>Guides</span>
              </button>

              <button
                onClick={() => navigate("/forum")}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
                </svg>
                <span>AI Chat</span>
              </button>

              <button
                onClick={() => navigate("/report")}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
                </svg>
                <span>API Reference</span>
              </button>

              <button
                onClick={() => navigate("/knowledge-base")}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
                </svg>
                <span>SDK Library</span>
              </button>

              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
                </svg>
                <span>Changelog</span>
              </button>
            </div>

            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={mainImage}
                alt="SafeSpace Documentation Platform"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}