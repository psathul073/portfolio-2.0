"use client";

import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useLoading } from "@/app/context/LoadingContext";
import { toast } from "d9-toast";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import FloatingButton from "./FloatingButton";

type messagesType = {
  sender: string;
  text: string;
}[];

type ChatBotPropType = {
  setOpenChatBox: Dispatch<SetStateAction<boolean>>;
};

function ChatBot({ setOpenChatBox }: ChatBotPropType) {
  const { isMobile } = useLoading();
  const [messages, setMessages] = useState<messagesType>([]);
  const [input, setInput] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const hasCheckedRef = useRef<boolean>(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // HEALTH CHECK WITH AUTO WAKE.
  const checkHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/health");

      // Is sleeping.
      if (!res.ok) {
        setIsOnline(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "😴 I'm currently sleeping..." },
          { sender: "bot", text: "🔄 Waking up... please wait ⏳" },
        ]);

        let attempts = 0;
        let success = false;

        while (attempts < 5 && !success) {
          await delay(3000);
          try {
            const retryRes = await fetch("/api/health");
            if (retryRes.ok) {
              success = true;
              break;
            }
          } catch {}

          attempts++;
        }

        if (success) {
          setIsOnline(true);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "🚀 I'm awake now! Ask me anything 😊",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "⚠️ Still waking up... please try again.",
            },
          ]);
        }
        setIsLoading(false);
        return;
      }

      // Is online.
      await res.text();
      setIsOnline(true);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "👋 Hello! I'm here to help visitors learn about his work. Feel free to ask about his projects, skills, or how to get in touch.",
        },
      ]);
    } catch {
      setIsOnline(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "😴 Server offline..." },
        { sender: "bot", text: "🔄 Trying to wake it up..." },
      ]);
      await delay(300);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Still waking up..." },
      ]);
    }
  }, []);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    checkHealth();
  }, [checkHealth]);

  // Auto-scroll to bottom when new messages arrive.
  const scrollToBottom: () => void = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Auto scroll when new message arrived.
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Handle outside click.
  useOutsideClick(chatBoxRef, (e) => {
    e.preventDefault();
    if (isMobile) {
      setIsMinimized(true);
    } else {
      setOpenChatBox(false);
    }
  });

  // Memoized message send function.
  const sendMessage: () => Promise<void> = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    if (!isOnline) {
      toast.warning("Assistant is offline. Try again later.", {
        theme: "dark",
      });
      return;
    }
    const userQuestion = input.trim();
    setMessages((preMsg) => [
      ...preMsg,
      { sender: "user", text: userQuestion },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data: { answer: string } = await res.json();

      setMessages((prevMsg) => [
        ...prevMsg,
        {
          sender: "bot",
          text:
            data.answer ||
            "I apologize, but I'm having trouble processing your question right now.",
        },
      ]);
    } catch (error) {
      console.error("chat error", error);
      setMessages((prevMsg) => [
        ...prevMsg,
        {
          sender: "bot",
          text: "I'm currently experiencing connection issues. Please try again in a moment or check out my portfolio directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOnline]);

  if (isMinimized && isMobile) {
    return <FloatingButton onClick={() => setIsMinimized(false)} />;
  }

  return (
    <div
      data-state={isMinimized || isMobile ? "min" : "max"}
      className={`chat-container rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden ${
        isMobile ? "bottom-0 right-0" : "bottom-5 right-5"
      } `}
      ref={chatBoxRef}
    >
      <ChatHeader
        isOnline={isOnline}
        isMobile={isMobile}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <QuickQuestions messages={messages} setInput={setInput} />

      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

export default memo(ChatBot);
