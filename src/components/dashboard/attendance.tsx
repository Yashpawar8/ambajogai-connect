import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck } from "lucide-react";

type Row = { id: string; subject: string; attended: number; total: number };

export function AttendanceTab() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    supabase.from("attendance").select("*").order("subject")
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  if (rows === null) return <p className="text-sm text-muted-foreground">Loading attendance…</p>;

  const overall = rows.length === 0
    ? 0
    : Math.round((rows.reduce((s, r) => s + r.attended, 0) / Math.max(1, rows.reduce((s, r) => s + r.total, 0))) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border bg-card p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CalendarCheck className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Overall attendance</p>
          <p className="text-3xl font-bold">{overall}%</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No attendance records yet. Your subject-wise attendance will appear here once published by the office.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const pct = r.total ? Math.round((r.attended / r.total) * 100) : 0;
            return (
              <div key={r.id} className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{r.subject}</span>
                  <span className="text-sm text-muted-foreground">{r.attended}/{r.total} · {pct}%</span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}