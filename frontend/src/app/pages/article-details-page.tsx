import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Heart,
  Share2,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

type Article = {
  id: number;
  title: string;
  category: string;
  readTime: string;
  intro: string;
  content: string[];
};

const articles: Article[] = [
  {
    id: 1,
    title: "How to recognize bullying early",
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

export function ArticleDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const articleId = Number(id);

  const article = useMemo(
    () => articles.find((item) => item.id === articleId),
    [articleId]
  );

  const relatedArticles = useMemo(
    () => articles.filter((item) => item.id !== articleId).slice(0, 3),
    [articleId]
  );

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="border rounded-xl p-10 text-center">
              <h1 className="text-3xl font-bold mb-3">Article not found</h1>
              <p className="text-gray-600 mb-6">
                The resource you are looking for does not exist or may have been removed.
              </p>
              <button
                onClick={() => navigate("/knowledge-base")}
                className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
              >
                Return to Knowledge Base
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <button
            onClick={() => navigate("/knowledge-base")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </button>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8">
              <article className="border rounded-xl p-8">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

                <p className="text-lg text-gray-600 leading-8 mb-8">
                  {article.intro}
                </p>

                <div className="space-y-6 text-[15px] leading-8 text-gray-700">
                  {article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="border-t mt-8 pt-6 flex items-center gap-4 text-sm text-gray-600">
                  <button className="inline-flex items-center gap-2 hover:text-black transition-colors">
                    <Heart className="w-4 h-4" />
                    Helpful
                  </button>
                  <button className="inline-flex items-center gap-2 hover:text-black transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </article>
            </section>

            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <h3 className="font-semibold">Need help right now?</h3>
                </div>
                <p className="text-sm text-gray-700 leading-6 mb-4">
                  If this topic feels personal or urgent, you can submit an anonymous
                  report or reach out through the support forum.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-medium"
                  >
                    Anonymous Report
                  </button>
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full border py-3 rounded-md hover:bg-white text-sm font-medium"
                  >
                    Support Forum
                  </button>
                </div>
              </div>

              <div className="border rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-gray-700 mt-0.5" />
                  <h4 className="font-semibold">More resources</h4>
                </div>
                <div className="space-y-3">
                  {relatedArticles.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => navigate(`/knowledge-base/${related.id}`)}
                      className="w-full text-left border rounded-md px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs text-emerald-600 block mb-1">
                        {related.category}
                      </span>
                      {related.title}
                    </button>
                  ))}
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