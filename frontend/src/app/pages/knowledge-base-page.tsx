import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { ArrowRight, BookOpen, LifeBuoy, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

type Category =
  | "All Resources"
  | "Bullying"
  | "Stress & Anxiety"
  | "Self-Help"
  | "Support for Friends";

export type Article = {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "All Resources">;
  readTime: string;
  intro?: string;
  content?: string[];
};

const STORAGE_KEY = "kb_articles";

const defaultArticles: Article[] = [
  {
    id: 1,
    title: "How to recognize bullying early",
    description:
      "Learn the common signs of bullying, exclusion, and repeated harmful behavior in school or online environments.",
    category: "Bullying",
    readTime: "4 min read",
    intro:
      "Bullying is often repeated behavior that causes emotional, social, or psychological harm. Recognizing it early can make support more effective.",
    content: [
      "Bullying is not always loud or obvious. It can appear as repeated exclusion, mocking, intimidation, humiliation, threats, or harmful online behavior. Sometimes students do not realize that a pattern has become bullying because each individual situation seems small on its own.",
      "Some common warning signs include sudden withdrawal from classmates, fear of going to school, changes in mood, loss of confidence, unexplained stress, and avoiding certain places or people. Online bullying may include repeated insulting messages, fake rumors, or deliberate embarrassment in chats or social media.",
      "If you notice these patterns in yourself or someone else, it is important to document what happened, speak to a trusted adult, mentor, counselor, or use a safe reporting channel. Early support can reduce long-term emotional harm.",
    ],
  },
  {
    id: 2,
    title: "Simple ways to manage stress before exams",
    description:
      "Practical techniques to reduce anxiety, stay organized, and calm yourself before academic pressure becomes overwhelming.",
    category: "Stress & Anxiety",
    readTime: "5 min read",
    intro:
      "Exam stress is common, but there are practical ways to reduce pressure and regain a sense of control.",
    content: [
      "Start by breaking revision into smaller tasks. A long list can feel overwhelming, but short focused sessions are often easier to manage. Try planning one realistic goal at a time.",
      "Physical regulation also matters. Deep breathing, short walks, stretching, and proper sleep can improve concentration and reduce panic. Even five calm minutes before an exam can help you think more clearly.",
      "If stress becomes intense or starts affecting your daily functioning, it may be a sign that you need extra support. Speaking to a counselor, mentor, or trusted person is a healthy step, not a failure.",
    ],
  },
  {
    id: 3,
    title: "What to do when a friend needs help",
    description:
      "A guide to supporting someone with empathy while encouraging them to seek help from trusted adults or services.",
    category: "Support for Friends",
    readTime: "6 min read",
    intro:
      "Supporting a friend does not mean solving everything alone. The most important step is to respond with care and consistency.",
    content: [
      "If a friend opens up to you, listen without judging or interrupting. Avoid saying things like 'just ignore it' or 'it is not a big deal.' Even if the situation seems small to you, it may feel serious to them.",
      "Ask simple supportive questions: 'Do you want to talk about what happened?' or 'Is there someone trusted we can talk to together?' These questions show care without pressure.",
      "If the situation involves bullying, threats, or serious emotional distress, encourage your friend to contact a trusted adult, counselor, or use an anonymous reporting system. You can support them, but you should not carry the whole responsibility alone.",
    ],
  },
  {
    id: 4,
    title: "Healthy coping strategies for difficult days",
    description:
      "Discover small but effective self-help habits that can support emotional wellbeing during stressful periods.",
    category: "Self-Help",
    readTime: "4 min read",
    intro:
      "Difficult days are part of life, but healthy coping habits can make those days more manageable.",
    content: [
      "Small actions can have a strong impact. Drinking water, eating regularly, getting enough sleep, and moving your body can support emotional stability more than people often expect.",
      "You can also build calming routines such as journaling, taking short breaks from overwhelming environments, reducing negative social media exposure, or talking to someone you trust.",
      "Healthy coping does not mean pretending everything is fine. It means choosing actions that protect your wellbeing while you seek support when needed.",
    ],
  },
  {
    id: 5,
    title: "What counts as cyberbullying?",
    description:
      "Understand how harmful online behavior appears and what evidence you should keep before reporting it.",
    category: "Bullying",
    readTime: "3 min read",
    intro:
      "Cyberbullying is harmful online behavior that is repeated and intentional. Knowing what it looks like can help you take action sooner.",
    content: [
      "Cyberbullying includes sending insulting or threatening messages, spreading false rumors online, sharing embarrassing photos without permission, excluding someone from group chats, or impersonating them to cause harm.",
      "Because it happens online, many people feel it is less serious than in-person bullying. In reality, online harassment can follow someone everywhere and feel inescapable, which can make it especially damaging.",
      "If you are experiencing cyberbullying, keep records of messages or screenshots, avoid responding to provocation, and report what happened to a trusted adult or through an anonymous reporting channel.",
    ],
  },
  {
    id: 6,
    title: "When stress becomes too much",
    description:
      "Recognize warning signs that indicate it may be time to speak with a counselor, mentor, or support service.",
    category: "Stress & Anxiety",
    readTime: "5 min read",
    intro:
      "There is a difference between normal stress and stress that is affecting your health, relationships, or ability to function.",
    content: [
      "Warning signs that stress has become too much include persistent difficulty sleeping, inability to concentrate, frequent physical symptoms like headaches or stomach aches, and losing interest in things you used to enjoy.",
      "When stress reaches this level, coping alone may not be enough. Reaching out to a counselor, school psychologist, mentor, or trusted adult is not a sign of weakness — it is a practical and healthy response.",
      "You do not need to wait until things feel unbearable. Seeking support early often makes recovery faster and easier. Using an anonymous report or the support forum can also be a first step if you are not ready to speak to someone directly.",
    ],
  },
];

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Article[];
  } catch {}
  return defaultArticles;
}

function saveArticles(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {}
}

const ARTICLE_CATEGORIES: Exclude<Category, "All Resources">[] = [
  "Bullying",
  "Stress & Anxiety",
  "Self-Help",
  "Support for Friends",
];

const ALL_CATEGORIES: Category[] = [
  "All Resources",
  "Bullying",
  "Stress & Anxiety",
  "Self-Help",
  "Support for Friends",
];

// ── Add Article Modal ──────────────────────────────────────────────────────────

function AddArticleModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (article: Article) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intro, setIntro] = useState("");
  const [category, setCategory] =
    useState<Exclude<Category, "All Resources">>("Bullying");
  const [readTime, setReadTime] = useState("5 min read");
  const [paragraphs, setParagraphs] = useState(["", "", ""]);
  const [error, setError] = useState("");

  function handleParagraph(index: number, value: string) {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function addParagraph() {
    setParagraphs((prev) => [...prev, ""]);
  }

  function removeParagraph(index: number) {
    if (paragraphs.length <= 1) return;
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!intro.trim()) {
      setError("Intro is required.");
      return;
    }
    const filledParagraphs = paragraphs.filter((p) => p.trim());
    if (filledParagraphs.length === 0) {
      setError("At least one paragraph of content is required.");
      return;
    }

    const article: Article = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      intro: intro.trim(),
      category,
      readTime: readTime.trim() || "5 min read",
      content: filledParagraphs,
    };
    onAdd(article);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl my-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
              Admin
            </p>
            <h2 className="text-2xl font-bold">Add New Article</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to handle conflict at school"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Exclude<Category, "All Resources">)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Read time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Short description (shown on cards)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="A brief summary visible in the article list"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Intro paragraph (shown at top of article)
            </label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              placeholder="An engaging opening paragraph"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Content paragraphs</label>
              <button
                onClick={addParagraph}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add paragraph
              </button>
            </div>
            <div className="space-y-3">
              {paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={p}
                    onChange={(e) => handleParagraph(i, e.target.value)}
                    rows={3}
                    placeholder={`Paragraph ${i + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                  {paragraphs.length > 1 && (
                    <button
                      onClick={() => removeParagraph(i)}
                      className="shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [articles, setArticles] = useState<Article[]>(loadArticles);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All Resources");
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // keep localStorage in sync
  useEffect(() => {
    saveArticles(articles);
  }, [articles]);

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
  }, [query, selectedCategory, articles]);

  function handleAddArticle(article: Article) {
    setArticles((prev) => [...prev, article]);
    setShowAddModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {showAddModal && (
        <AddArticleModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddArticle}
        />
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">Knowledge Base</h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Explore trusted resources about bullying, emotional wellbeing,
                stress, and how to support yourself or others.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-gray-800 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Article
              </button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Categories</h2>

                <div className="space-y-2">
                  {ALL_CATEGORIES.map((category) => (
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