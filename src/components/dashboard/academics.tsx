import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, Clock, FileText } from "lucide-react";

type Item = { id: string; type: string; title: string; details: string; department: string | null; semester: number | null };

const typeMeta: Record<string, { label: string; icon: typeof BookOpen }> = {
  syllabus: { label: "Syllabus", icon: BookOpen },
  calendar: { label: "Academic Calendar", icon: Calendar },
  timetable: { label: "Timetable", icon: Clock },
  exam_schedule: { label: "Exam Schedule", icon: FileText },
};

export function AcademicsTab() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    supabase.from("academic_info").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  const groups = Object.keys(typeMeta);

  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const list = items.filter((i) => i.type === g);
        const m = typeMeta[g];
        const Icon = m.icon;
        return (
          <section key={g}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Icon className="h-5 w-5 text-primary" /> {m.label}
            </h3>
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">No entries yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((i) => (
                  <article key={i.id} className="rounded-xl border bg-card p-4">
                    <h4 className="font-semibold">{i.title}</h4>
                    {(i.department || i.semester) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {i.department}{i.department && i.semester ? " · " : ""}{i.semester ? `Sem ${i.semester}` : ""}
                      </p>
                    )}
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{i.details}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}