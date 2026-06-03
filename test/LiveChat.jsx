import { useEffect, useRef, useState } from "react";
import { socket } from "../../lib/socket";

export default function LiveChat({ liveId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!liveId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_live_chat", { liveId });

    const handleMessage = (message) => {
      setMessages((prev) => [...prev.slice(-30), message]);
    };

    const handleChatError = (error) => {
      setChatError(error?.message || "Unable to send chat message");
    };

    socket.on("receive_live_message", handleMessage);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.emit("leave_live_chat", { liveId });
      socket.off("receive_live_message", handleMessage);
      socket.off("chat_error", handleChatError);
    };
  }, [liveId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || !liveId) return;

    setChatError("");
    socket.emit("send_live_message", {
      liveId,
      text,
    });

    setInput("");
  };

  return (
    <aside className="w-[320px] shrink-0 bg-[#141414] border border-white/[0.08] rounded-lg flex flex-col h-[600px]">
      <div className="px-4 py-3 border-b border-white/[0.08] flex items-center gap-2 shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-white/90 text-[14px] font-semibold">Live chat</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
      >
        {messages.map((m) => (
          <div key={m.id} className="text-[13px] leading-[1.4]">
            <span style={{ color: m.color || "#7BAEFF" }} className="font-semibold">
              {m.user || "user"}
            </span>
            <span className="text-white/70 ml-1.5">{m.text}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="px-3 py-3 border-t border-white/[0.08] flex gap-2 shrink-0"
      >
        <div className="flex-1 min-w-0">
          {chatError && (
            <p className="mb-2 text-[12px] text-red-300">{chatError}</p>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            maxLength={140}
            className="w-full bg-white/[0.05] border border-white/10 rounded-md px-3 py-2 text-[13px] text-white/85 placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3 py-2 rounded-md bg-accent text-white text-[12px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors self-end"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
