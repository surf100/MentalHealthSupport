import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-md mx-auto px-8 py-16 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(153,211,223,0.35)" }}
            >
              <SearchX className="w-7 h-7" style={{ color: "#274C77" }} />
            </div>
          </div>

          {/* 404 */}
          <p
            className="font-display text-[96px] leading-none tracking-[-0.05em] mb-2"
            style={{ color: "#274C77" }}
          >
            404
          </p>

          <p
            className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] mb-4"
            style={{ color: "#6096BA" }}
          >
            Page not found
          </p>

          <p
            className="font-sans text-[15px] leading-[1.75] tracking-[-0.01em] mb-10"
            style={{ color: "rgba(36,76,90,0.60)" }}
          >
            The page you're looking for doesn't exist or you don't have
            permission to access it.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm border transition"
              style={{ borderColor: "rgba(36,76,90,0.22)", color: "#274C77", backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(36,76,90,0.40)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(36,76,90,0.22)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Go back
            </button>

            <button
              onClick={() => navigate("/")}
              className="font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm transition"
              style={{ backgroundColor: "#274C77", color: "#F9F7F3" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
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