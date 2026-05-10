import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { ArrowRight, BookOpen, LifeBuoy, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Category =
  | "All Resources"
  | "Bullying"
  | "Stress & Anxiety"
  | "Self-Help"
  | "Support for Friends";

type Article = {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "All Resources">;
  readTime: string;
};

const categories: Category[] = [
  "All Resources",
  "Bullying",
  "Stress & Anxiety",
  "Self-Help",
  "Support for Friends",
];

const articles: Article[] = [
  {
    id: 1,
    title: "How to recognize bullying early",
    description:
      "Learn the common signs of bullying, exclusion, and repeated harmful behavior in school or online environments.",
    category: "Bullying",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Simple ways to manage stress before exams",
    description:
      "Practical techniques to reduce anxiety, stay organized, and calm yourself before academic pressure becomes overwhelming.",
    category: "Stress & Anxiety",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "What to do when a friend needs help",
    description:
      "A guide to supporting someone with empathy while encouraging them to seek help from trusted adults or services.",
    category: "Support for Friends",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Healthy coping strategies for difficult days",
    description:
      "Discover small but effective self-help habits that can support emotional wellbeing during stressful periods.",
    category: "Self-Help",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "What counts as cyberbullying?",
    description:
      "Understand how harmful online behavior appears and what evidence you should keep before reporting it.",
    category: "Bullying",
    readTime: "3 min read",
  },
  {
    id: 6,
    title: "When stress becomes too much",
    description:
      "Recognize warning signs that indicate it may be time to speak with a counselor, mentor, or support service.",
    category: "Stress & Anxiety",
    readTime: "5 min read",
  },
];

export function KnowledgeBasePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All Resources");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All Resources" ||
        article.category === selectedCategory;

      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.description.toLowerCase().includes(normalizedQuery) ||
        article.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Knowledge Base</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Explore trusted resources about bullying, emotional wellbeing,
              stress, and how to support yourself or others.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Categories</h2>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-3 rounded-md text-sm ${
                        selectedCategory === category
                          ? "bg-emerald-50 text-emerald-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="col-span-6">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resources"
                  className="w-full outline-none text-sm"
                />
              </div>

              {filteredArticles.length === 0 ? (
                <div className="border rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-sm text-gray-600">
                    Try another category or search with different keywords.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => navigate(`/knowledge-base/${article.id}`)}
                      className="border rounded-xl p-6 hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold mb-2">
                        {article.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-6 mb-4">
                        {article.description}
                      </p>

                      <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                        Read article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <aside className="col-span-3 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3 mb-3">
                  <LifeBuoy className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Need immediate help?</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-6 mb-4">
                  If you are in distress or feel unsafe, do not wait. Use the
                  anonymous report form or contact crisis support now.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                  >
                    Anonymous Report
                  </button>

                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full border py-3 rounded-md hover:bg-gray-50"
                  >
                    Support Forum
                  </button>
                </div>
              </div>

              <div className="border rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Featured topics</h4>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Recognizing bullying patterns</p>
                  <p>• Managing emotional stress</p>
                  <p>• Helping a friend safely</p>
                  <p>• Building healthy coping habits</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}