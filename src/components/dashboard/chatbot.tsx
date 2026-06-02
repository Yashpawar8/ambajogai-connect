import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { askChatbot } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User as UserIcon, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatbotTab() {
  const ask = useServerFn(askChatbot);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm the MBES Ambajogai AI assistant. Ask me anything about admissions, courses, fees, hostel, placements, faculty, timings, or any college-related query." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (q: string) => {
    const question = q.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next.map((m) => ({ role: m.role, content: m.content })) } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't respond just now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What courses are offered?",
    "How is the admission process?",
    "Tell me about hostel facilities",
    "What are the college timings?",
    "Which companies visit for placements?",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="flex h-[65vh] flex-col rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">College AI Assistant</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <Bot className="h-6 w-6 shrink-0 text-primary" />}
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
              {m.role === "user" && <UserIcon className="h-6 w-6 shrink-0 text-muted-foreground" />}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <Bot className="h-6 w-6 shrink-0 text-primary" />
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2 border-t p-3"
        >
          <Input placeholder="Ask anything about MBES College…" value={input} onChange={(e) => setInput(e.target.value)} disabled={loading} />
          <Button type="submit" size="icon" disabled={loading}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Suggested questions</p>
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} disabled={loading} className="rounded-md border bg-background px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}