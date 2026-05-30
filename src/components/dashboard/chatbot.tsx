import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User as UserIcon } from "lucide-react";

type FAQ = { id: string; question: string; answer: string; keywords: string[] };
type Msg = { role: "user" | "bot"; text: string };

function matchAnswer(q: string, faqs: FAQ[]): string {
  const text = q.toLowerCase();
  let best: { faq: FAQ; score: number } | null = null;
  for (const f of faqs) {
    let score = 0;
    for (const k of f.keywords) if (text.includes(k.toLowerCase())) score += 2;
    for (const w of f.question.toLowerCase().split(/\W+/)) {
      if (w.length > 3 && text.includes(w)) score += 1;
    }
    if (!best || score > best.score) best = { faq: f, score };
  }
  if (!best || best.score === 0) {
    return "I'm not sure about that yet. Try asking about timings, fees, library, exams, admissions, hostel or placements — or check the Notice Board tab.";
  }
  return best.faq.answer;
}

export function ChatbotTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm the MBES Ambajogai assistant. Ask me about timings, fees, library, exams, admissions, hostel or placements." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("faqs").select("*").then(({ data }) => setFaqs((data as FAQ[]) ?? []));
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (q: string) => {
    const question = q.trim();
    if (!question) return;
    const answer = matchAnswer(question, faqs);
    setMessages((m) => [...m, { role: "user", text: question }, { role: "bot", text: answer }]);
    setInput("");
  };

  const suggestions = ["What is the college timing?", "How can I pay fees?", "Where is the library?", "What are exam dates?"];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="flex h-[60vh] flex-col rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">FAQ Chatbot</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "bot" && <Bot className="h-6 w-6 shrink-0 text-primary" />}
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.text}
              </div>
              {m.role === "user" && <UserIcon className="h-6 w-6 shrink-0 text-muted-foreground" />}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2 border-t p-3"
        >
          <Input placeholder="Ask a question…" value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Suggested questions</p>
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-md border bg-background px-3 py-2 text-left text-sm hover:bg-muted">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}