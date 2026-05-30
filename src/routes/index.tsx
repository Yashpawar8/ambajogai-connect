import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageCircle, Bell, BookOpen, CalendarCheck, Building2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MBES Ambajogai — Student Enquiry Portal" },
      { name: "description", content: "Official student enquiry portal for MBES College of Engineering, Ambajogai. Notices, FAQs, academics and attendance in one place." },
      { property: "og:title", content: "MBES Ambajogai — Student Enquiry Portal" },
      { property: "og:description", content: "Notices, FAQs, academics and attendance for MBES College of Engineering, Ambajogai students." },
    ],
  }),
  component: Index,
});

function Index() {
  const features = [
    { icon: MessageCircle, title: "FAQ Chatbot", desc: "Instant answers to admission, fees, library and exam questions." },
    { icon: Bell, title: "Notice Board", desc: "Exam notifications, holidays, placement and announcements." },
    { icon: BookOpen, title: "Academics", desc: "Syllabus, timetable, calendar and exam schedule." },
    { icon: CalendarCheck, title: "Attendance", desc: "Track your subject-wise attendance anytime." },
    { icon: Building2, title: "College Info", desc: "Departments, faculty and campus facilities." },
    { icon: GraduationCap, title: "Student Login", desc: "Secure login with email and PRN-linked profile." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">MBES College of Engineering</p>
              <p className="text-xs text-muted-foreground">Ambajogai</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/signup">Sign Up</Link></Button>
          </div>
        </div>
      </header>

      <section
        className="px-6 py-20 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm uppercase tracking-widest opacity-80">Student Enquiry Portal</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Everything you need to know about MBES Ambajogai — in one place.
          </h1>
          <p className="mt-5 text-lg opacity-90">
            Admission queries, notices, academics, FAQ chatbot and attendance for students of
            MBES College of Engineering, Ambajogai.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/signup">Get Started</Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 transition hover:shadow-lg">
              <f.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-card/40">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MBES College of Engineering, Ambajogai
        </div>
      </footer>
    </div>
  );
}
