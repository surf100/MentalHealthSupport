import { Header } from "../components/header";
import { Footer } from "../components/footer";
import mainImage from "../../assets/home.jpg";
import { Link } from "react-router-dom";

export function HomePage() {
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
              <Link
                to="/report"
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
              >
                Report anonymously
              </Link>

              <Link
                to="/forum"
                className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100"
              >
                Explore support forum
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
              <div className="grid grid-cols-2">
                
                {/* Left side */}
                <div className="p-12 bg-white">
                  <p className="text-sm font-medium text-emerald-700 mb-4">
                    SafeSpace Mission
                  </p>

                  <h2 className="text-4xl font-bold mb-5">
                    We help students feel heard, supported, and protected
                  </h2>

                  <p className="text-gray-600 leading-7 mb-8">
                    SafeSpace creates a secure digital environment where students can
                    report bullying anonymously, find peer support, and access mental
                    health resources without fear of judgment.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    
                    <Link
                      to="/report"
                      className="border rounded-xl p-5 text-left hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                        <span className="text-emerald-700 font-bold">→</span>
                      </div>

                      <p className="font-medium">Submit Report</p>
                      <p className="text-sm text-gray-500">
                        Report incidents anonymously
                      </p>
                    </Link>

                    <Link
                      to="/forum"
                      className="border rounded-xl p-5 text-left hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                        <span className="text-emerald-700 font-bold">💬</span>
                      </div>

                      <p className="font-medium">Community</p>
                      <p className="text-sm text-gray-500">
                        Join support discussions
                      </p>
                    </Link>

                  </div>
                </div>

                {/* Right side */}
                <div className="bg-gray-100 flex items-center justify-center">
                  <img
                    src={mainImage}
                    alt="SafeSpace illustration"
                    className="object-cover h-full w-full"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}