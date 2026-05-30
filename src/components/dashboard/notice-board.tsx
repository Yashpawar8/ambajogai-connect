import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Calendar, PartyPopper, Briefcase, Megaphone } from "lucide-react";

type Notice = { id: string; title: string; body: string; category: string; posted_at: string };

const meta: Record<string, { label: string; icon: typeof Bell; color: string }> = {
  announcement: { label: "Announcement", icon: Megaphone, color: "text-primary" },
  exam: { label: "Exam", icon: Calendar, color: "text-accent-foreground" },
  holiday: { label: "Holiday", icon: PartyPopper, color: "text-accent-foreground" },
  placement: { label: "Placement", icon: Briefcase, color: "text-primary" },
};

export function NoticeBoardTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    supabase.from("notices").select("*").order("posted_at", { ascending: false })
      .then(({ data }) => setNotices((data as Notice[]) ?? []));
  }, []);

  const filtered = filter === "all" ? notices : notices.filter((n) => n.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "announcement", "exam", "holiday", "placement"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-sm capitalize transition ${filter === c ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
          >
            {c === "all" ? "All" : meta[c]?.label ?? c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No notices.</p>}
        {filtered.map((n) => {
          const m = meta[n.category] ?? meta.announcement;
          const Icon = m.icon;
          return (
            <article key={n.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 ${m.color}`} />
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(n.posted_at).toLocaleDateString()}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}