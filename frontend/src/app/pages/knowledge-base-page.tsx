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

/* оставь твой defaultArticles без изменений */
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
    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!intro.trim()) return setError("Intro is required.");

    const filledParagraphs = paragraphs.filter((p) => p.trim());
    if (filledParagraphs.length === 0) {
      setError("At least one paragraph of content is required.");
      return;
    }

    onAdd({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      intro: intro.trim(),
      category,
      readTime: readTime.trim() || "5 min read",
      content: filledParagraphs,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#274C77]/40 px-4 py-8">
      <div className="my-auto w-full max-w-2xl rounded-2xl border border-[#274C77]/10 bg-white p-8 shadow-[0_8px_32px_rgba(39,76,119,0.14)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6096BA]">
              Admin
            </p>
            <h2 className="font-display text-3xl tracking-[-0.03em] text-[#274C77]">
              Add New Article
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#274C77]/50 transition hover:bg-[#E7ECEF] hover:text-[#274C77]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {[
            { label: "Title", value: title, setter: setTitle, placeholder: "e.g. How to handle conflict at school" },
            { label: "Read time", value: readTime, setter: setReadTime, placeholder: "5 min read" },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-2 block font-sans text-sm font-semibold text-[#274C77]">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-[#274C77]/15 bg-[#F8FBFD] px-4 py-3 text-sm text-[#274C77] outline-none transition focus:border-[#6096BA]/50 focus:ring-2 focus:ring-[#6096BA]/15"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block font-sans text-sm font-semibold text-[#274C77]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Exclude<Category, "All Resources">)
              }
              className="w-full rounded-lg border border-[#274C77]/15 bg-[#F8FBFD] px-4 py-3 text-sm text-[#274C77] outline-none transition focus:border-[#6096BA]/50 focus:ring-2 focus:ring-[#6096BA]/15"
            >
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-sans text-sm font-semibold text-[#274C77]">
              Short description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-[#274C77]/15 bg-[#F8FBFD] px-4 py-3 text-sm text-[#274C77] outline-none transition focus:border-[#6096BA]/50 focus:ring-2 focus:ring-[#6096BA]/15"
            />
          </div>

          <div>
            <label className="mb-2 block font-sans text-sm font-semibold text-[#274C77]">
              Intro paragraph
            </label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[#274C77]/15 bg-[#F8FBFD] px-4 py-3 text-sm text-[#274C77] outline-none transition focus:border-[#6096BA]/50 focus:ring-2 focus:ring-[#6096BA]/15"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-sans text-sm font-semibold text-[#274C77]">
                Content paragraphs
              </label>
              <button
                onClick={addParagraph}
                className="flex items-center gap-1 text-xs font-semibold text-[#6096BA] hover:text-[#274C77]"
              >
                <Plus className="h-3 w-3" /> Add paragraph
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
                    className="flex-1 resize-none rounded-lg border border-[#274C77]/15 bg-[#F8FBFD] px-4 py-3 text-sm text-[#274C77] outline-none transition focus:border-[#6096BA]/50 focus:ring-2 focus:ring-[#6096BA]/15"
                  />
                  {paragraphs.length > 1 && (
                    <button
                      onClick={() => removeParagraph(i)}
                      className="shrink-0 rounded-lg p-2 text-[#274C77]/40 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
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
            className="rounded-sm border border-[#274C77]/20 px-5 py-2.5 text-sm font-semibold text-[#274C77] hover:bg-[#F8FBFD]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-sm bg-[#274C77] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1F3C5F]"
          >
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [articles, setArticles] = useState<Article[]>(loadArticles);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All Resources");
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-[#E7ECEF] text-[#274C77]">
      <Header />

      {showAddModal && (
        <AddArticleModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddArticle}
        />
      )}

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#274C77]/10 bg-[#E7ECEF]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#A3CEF1_1px,transparent_1px)] [background-size:30px_30px]" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-8 py-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#6096BA]">
                SafeSpace resources
              </p>
              <h1 className="font-display text-[48px] leading-[1.05] tracking-[-0.04em] text-[#274C77] sm:text-[64px]">
                Knowledge Base
              </h1>
              <p className="mt-4 max-w-3xl font-sans text-[17px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/60">
                Explore trusted resources about bullying, emotional wellbeing,
                stress, and how to support yourself or others.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#274C77] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F3C5F]"
              >
                <Plus className="h-4 w-4" />
                Add Article
              </button>
            )}
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-8 py-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-[#274C77]/10 bg-white p-6 shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
              <h2 className="mb-4 font-display text-2xl tracking-[-0.03em] text-[#274C77]">
                Categories
              </h2>

              <div className="space-y-2">
                {ALL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      selectedCategory === category
                        ? "bg-[#A3CEF1]/45 text-[#274C77]"
                        : "text-[#274C77]/65 hover:bg-[#F8FBFD] hover:text-[#274C77]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#274C77]/10 bg-white px-4 py-3 shadow-[0_8px_32px_rgba(39,76,119,0.06)]">
              <Search className="h-4 w-4 text-[#274C77]/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources"
                className="w-full bg-transparent text-sm text-[#274C77] outline-none placeholder:text-[#274C77]/35"
              />
            </div>

            {filteredArticles.length === 0 ? (
              <div className="rounded-2xl border border-[#274C77]/10 bg-white p-8 text-center shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
                <h3 className="mb-2 font-display text-2xl tracking-[-0.03em] text-[#274C77]">
                  No resources found
                </h3>
                <p className="text-sm leading-6 text-[#274C77]/60">
                  Try another category or search with different keywords.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => navigate(`/knowledge-base/${article.id}`)}
                    className="cursor-pointer rounded-2xl border border-[#274C77]/10 bg-white p-6 shadow-[0_8px_32px_rgba(39,76,119,0.06)] transition hover:-translate-y-0.5 hover:border-[#6096BA]/40 hover:shadow-[0_12px_36px_rgba(39,76,119,0.10)]"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <span className="rounded-full bg-[#A3CEF1]/45 px-3 py-1 text-xs font-semibold text-[#274C77]">
                        {article.category}
                      </span>
                      <span className="text-xs text-[#274C77]/45">
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="mb-2 font-display text-2xl tracking-[-0.03em] text-[#274C77]">
                      {article.title}
                    </h3>

                    <p className="mb-4 text-sm leading-6 text-[#274C77]/60">
                      {article.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6096BA]">
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-[#274C77]/10 bg-[#A3CEF1]/35 p-6 shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
              <div className="mb-3 flex items-start gap-3">
                <LifeBuoy className="mt-0.5 h-5 w-5 text-[#274C77]" />
                <h3 className="font-display text-2xl tracking-[-0.03em] text-[#274C77]">
                  Need immediate help?
                </h3>
              </div>

              <p className="mb-4 text-sm leading-6 text-[#274C77]/65">
                If you are in distress or feel unsafe, do not wait. Use the
                anonymous report form or contact crisis support now.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/report")}
                  className="w-full rounded-sm bg-[#274C77] py-3 text-sm font-semibold text-white transition hover:bg-[#1F3C5F]"
                >
                  Anonymous Report
                </button>

                <button
                  onClick={() => navigate("/forum")}
                  className="w-full rounded-sm border border-[#274C77]/20 bg-white/60 py-3 text-sm font-semibold text-[#274C77] transition hover:bg-white"
                >
                  Support Forum
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#274C77]/10 bg-white p-6 shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
              <div className="mb-3 flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 text-[#274C77]/70" />
                <h4 className="font-display text-2xl tracking-[-0.03em] text-[#274C77]">
                  Featured topics
                </h4>
              </div>

              <div className="space-y-3 text-sm leading-6 text-[#274C77]/60">
                <p>• Recognizing bullying patterns</p>
                <p>• Managing emotional stress</p>
                <p>• Helping a friend safely</p>
                <p>• Building healthy coping habits</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}