import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

type Issue = {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const authorities = [
  { name: "Dr. Khadakbhave Sir", role: "Principal", email: "principal@mbescoea.org", phone: "+91-2446-247222" },
  { name: "Prof. Kulkarni Sir", role: "HOD — Computer Science", email: "hod.cse@mbescoea.org", phone: "+91-2446-247223" },
  { name: "Prof. Yerigiri Sir", role: "HOD — Electronics & Telecommunication", email: "hod.entc@mbescoea.org", phone: "+91-2446-247224" },
];

export function AuthorityTab() {
  const { user } = useAuth();
  const [category, setCategory] = useState("attendance");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issues, setIssues] = useState<Issue[] | null>(null);

  const load = async () => {
    const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false });
    setIssues((data as Issue[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill subject and message");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("issues").insert({
      user_id: user.id,
      category,
      subject: subject.trim(),
      message: message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit issue");
      return;
    }
    toast.success("Issue submitted to the authority");
    setSubject("");
    setMessage("");
    load();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Authority Window</h2>
            <p className="mt-1 text-muted-foreground">
              Raise complaints or queries about attendance, assignment submissions, or any academic issue.
              The concerned authority will respond at the earliest.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Contact Authorities</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {authorities.map((a) => (
            <div key={a.name} className="rounded-lg border bg-card p-4">
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.role}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {a.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {a.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Raise an Issue</h3>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Issue</SelectItem>
                <SelectItem value="submission">Assignment / Submission Issue</SelectItem>
                <SelectItem value="exam">Examination Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" />
          </div>
          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail" rows={5} />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit to Authority"}</Button>
        </form>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">My Submitted Issues</h3>
        {issues === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : issues.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
            You have not raised any issues yet.
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((i) => (
              <div key={i.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{i.subject}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{i.category}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{i.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}