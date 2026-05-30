import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { CollegeInfoTab } from "@/components/dashboard/college-info";
import { ChatbotTab } from "@/components/dashboard/chatbot";
import { NoticeBoardTab } from "@/components/dashboard/notice-board";
import { AcademicsTab } from "@/components/dashboard/academics";
import { AttendanceTab } from "@/components/dashboard/attendance";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MBES Ambajogai" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">MBES College of Engineering</p>
              <p className="text-xs text-muted-foreground">Ambajogai · Student Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate({ to: "/", replace: true }); }}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="mb-6 flex w-full flex-wrap justify-start">
            <TabsTrigger value="chatbot">FAQ Chatbot</TabsTrigger>
            <TabsTrigger value="college">College Info</TabsTrigger>
            <TabsTrigger value="notices">Notice Board</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="chatbot"><ChatbotTab /></TabsContent>
          <TabsContent value="college"><CollegeInfoTab /></TabsContent>
          <TabsContent value="notices"><NoticeBoardTab /></TabsContent>
          <TabsContent value="academics"><AcademicsTab /></TabsContent>
          <TabsContent value="attendance"><AttendanceTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}