import { Logo } from "./logo";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a1a1a] text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between gap-8">
        <button onClick={() => navigate("/")} className="cursor-pointer">
          <Logo className="text-white" />
        </button>

        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={() => navigate("/privacy")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy
          </button>

          <button
            onClick={() => navigate("/terms")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms
          </button>

          <button
            onClick={() => navigate("/community-guidelines")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Community Guidelines
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}