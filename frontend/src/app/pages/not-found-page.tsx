import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { useNavigate } from "react-router";
import { SearchX } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto px-8 py-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <SearchX className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-3">404</h1>
          <p className="text-xl font-semibold mb-3">Page not found</p>
          <p className="text-gray-600 text-sm leading-6 mb-8">
            The page you're looking for doesn't exist or you don't have
            permission to access it.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="border px-5 py-2.5 rounded-md text-sm hover:bg-gray-50"
            >
              Go back
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-5 py-2.5 rounded-md text-sm hover:bg-gray-800"
            >
              Go home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}