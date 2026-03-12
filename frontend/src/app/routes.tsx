import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home-page";
import { SignUpPage } from "./pages/sign-up-page";
import { DashboardPage } from "./pages/dashboard-page";
import { AnonymousReportPage } from "./pages/anonymous-report-page";
import { ReportSubmittedPage } from "./pages/report-submitted-page";
import { SupportForumPage } from "./pages/support-forum-page";
import { CreatePostPage } from "./pages/create-post-page";
import { PostDetailsPage } from "./pages/post-details-page";
import { KnowledgeBasePage } from "./pages/knowledge-base-page";
import { ArticleDetailsPage } from "./pages/article-details-page";
import { CrisisHelpPage } from "./pages/crisis-help-page";
import { MyReportsPage } from "./pages/my-reports-page";
import { ReportDetailsPage } from "./pages/report-details-page";
import { NotificationsPage } from "./pages/notifications-page";
import { AchievementsPage } from "./pages/achievements-page";
import { ProfilePage } from "./pages/profile-page";
import { SettingsPage } from "./pages/settings-page";
import { PrivacyPage } from "./pages/privacy-page";
import { TermsPage } from "./pages/terms-page";
import { AdminUsersPage } from "./pages/admin-users-page";
import { AdminAuditLogPage } from "./pages/admin-audit-log-page";
import { AdminAnalyticsPage } from "./pages/admin-analytics-page";
import { CommunityGuidelinesPage } from "./pages/community-guidelines-page";
import { AboutPage } from "./pages/about-page";
import { ContactPage } from "./pages/contact-page";
import { SignInPage } from "./pages/sign-in-page";
import { ProtectedRoute } from "./components/protected-route";
import { PublicOnlyRoute } from "./components/public-only-route";
import { AdminRoute } from "./components/admin-route";
import { NotFoundPage } from "./pages/not-found-page";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },

  {
    path: "/sign-up",
    Component: () => (
      <PublicOnlyRoute>
        <SignUpPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/sign-in",
    Component: () => (
      <PublicOnlyRoute>
        <SignInPage />
      </PublicOnlyRoute>
    ),
  },

  {
    path: "/dashboard",
    Component: () => (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report",
    Component: () => (
      <ProtectedRoute>
        <AnonymousReportPage />
      </ProtectedRoute>
    ),
  },
  { path: "/report-submitted", Component: ReportSubmittedPage },

  { path: "/forum", Component: SupportForumPage },
  {
    path: "/forum/create",
    Component: () => (
      <ProtectedRoute>
        <CreatePostPage />
      </ProtectedRoute>
    ),
  },
  { path: "/forum/:id", Component: PostDetailsPage },

  { path: "/knowledge-base", Component: KnowledgeBasePage },
  { path: "/knowledge-base/:id", Component: ArticleDetailsPage },
  { path: "/crisis-help", Component: CrisisHelpPage },

  {
    path: "/my-reports",
    Component: () => (
      <ProtectedRoute>
        <MyReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-reports/:id",
    Component: () => (
      <ProtectedRoute>
        <ReportDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    Component: () => (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/achievements",
    Component: () => (
      <ProtectedRoute>
        <AchievementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    Component: () => (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    Component: () => (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  { path: "/privacy", Component: PrivacyPage },
  { path: "/terms", Component: TermsPage },

  {
    path: "/admin/users",
    Component: () => (
      <AdminRoute>
        <AdminUsersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/audit-log",
    Component: () => (
      <AdminRoute>
        <AdminAuditLogPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/analytics",
    Component: () => (
      <AdminRoute>
        <AdminAnalyticsPage />
      </AdminRoute>
    ),
  },

  { path: "/community-guidelines", Component: CommunityGuidelinesPage },
  { path: "/about", Component: AboutPage },
  { path: "/contact", Component: ContactPage },
  { path: "/404", Component: NotFoundPage },
  { path: "*", Component: NotFoundPage },
]);